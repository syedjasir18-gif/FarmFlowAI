import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, MandiMarket } from '../types';

// Read Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Lazy singleton client initialization
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
};

/* =========================================================================
   SUPABASE DATABASE SCHEMA SPECIFICATION FOR PRODUCTION DEPLOYMENT
   (Can be executed in Supabase SQL Editor by the platform owner)
========================================================================= */
export const SUPABASE_SQL_SCHEMA = `
-- 1. STAKEHOLDER PROFILES TABLE
create table if not exists public.user_profiles (
  id text primary key,
  email text unique,
  full_name text not null,
  role text not null check (role in ('farmer', 'buyer_warehouse', 'transport_owner', 'admin')),
  phone text,
  location text,
  subscription_tier text default 'free',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. FARM HARVEST LOTS & DISPATCH REGISTRY
create table if not exists public.harvest_lots (
  id text primary key,
  user_id text references public.user_profiles(id) on delete cascade,
  crop_name text not null,
  variety text,
  quantity_kg numeric not null,
  harvest_date date default current_date,
  target_mandi text,
  estimated_net_inr numeric,
  dockage_deduction_pct numeric default 0,
  status text default 'ready' check (status in ('ready', 'booked', 'in_transit', 'sold', 'disputed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SHARED TRANSPORT CORRIDORS & FLEET TRIPS
create table if not exists public.transport_trips (
  id text primary key,
  corridor_name text not null,
  origin_taluk text not null,
  destination_mandi text not null,
  vehicle_type text not null,
  vehicle_number text not null,
  driver_name text not null,
  driver_phone text not null,
  max_capacity_kg numeric not null,
  current_payload_kg numeric default 0,
  departure_time time not null,
  status text default 'open' check (status in ('open', 'dispatched', 'completed', 'cancelled')),
  total_fare_inr numeric not null,
  platform_margin_inr numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. REAL MANDI ARRIVALS & PRICE QUOTES (AGMARKNET & E-NAM SYNCED)
create table if not exists public.mandi_prices (
  id bigint generated always as identity primary key,
  mandi_code text not null,
  mandi_name text not null,
  district text not null,
  state text not null,
  crop text not null,
  modal_price_per_kg numeric not null,
  min_price_per_kg numeric not null,
  max_price_per_kg numeric not null,
  arrival_tonnes numeric not null,
  recorded_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. COMMERCIAL PLATFORM REVENUE & ESCROW SETTLEMENTS
create table if not exists public.platform_transactions (
  id text primary key,
  lot_id text,
  farmer_id text not null,
  buyer_id text,
  gross_value_inr numeric not null,
  net_realized_inr numeric not null,
  logistics_fee_inr numeric not null,
  platform_commission_inr numeric not null, -- 1.5% commercial take-rate
  payment_status text default 'escrow_locked' check (payment_status in ('escrow_locked', 'settled_dbt', 'refunded', 'disputed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.harvest_lots enable row level security;
alter table public.transport_trips enable row level security;
alter table public.mandi_prices enable row level security;
alter table public.platform_transactions enable row level security;

-- Public read policies for prices & open corridors
create policy "Allow public price reading" on public.mandi_prices for select using (true);
create policy "Allow public transport reading" on public.transport_trips for select using (true);
`;

/* =========================================================================
   REAL SUPABASE DATA ACCESS LAYER (WITH SECURE CACHE FALLBACK)
========================================================================= */

export async function syncUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('user_profiles')
      .upsert({
        id: profile.id,
        email: profile.email,
        full_name: profile.name,
        role: profile.role,
        phone: profile.phone,
        location: profile.location,
        metadata: {
          farmDetails: profile.farmDetails,
          buyerWarehouseDetails: profile.buyerWarehouseDetails,
          transportDetails: profile.transportDetails,
          adminDetails: profile.adminDetails,
        },
      }, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase Sync Warning]:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase Exception]:', err);
    return false;
  }
}

export async function recordPlatformTransaction(txn: {
  lotId: string;
  farmerId: string;
  buyerId?: string;
  grossAmount: number;
  netRealized: number;
  logisticsFee: number;
  platformCommission: number;
}): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('platform_transactions')
      .insert({
        id: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        lot_id: txn.lotId,
        farmer_id: txn.farmerId,
        buyer_id: txn.buyerId || 'DIRECT_MANDI',
        gross_value_inr: txn.grossAmount,
        net_realized_inr: txn.netRealized,
        logistics_fee_inr: txn.logisticsFee,
        platform_commission_inr: txn.platformCommission,
        payment_status: 'escrow_locked',
      });

    return !error;
  } catch {
    return false;
  }
}
