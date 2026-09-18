import { UserProfile, UserRole } from '../types';
import { syncUserProfileToSupabase } from '../lib/supabase';

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  farmer: {
    id: 'usr-farmer-01',
    name: 'Murugan Karuppasamy',
    role: 'farmer',
    email: 'farmer.murugan@farmflow.ai',
    phone: '+91 98421 87210',
    location: 'Dindigul West, Tamil Nadu',
    verified: true,
    farmDetails: {
      landAcres: 4.5,
      primaryCrops: ['Tomato', 'Onion', 'Green Chilli'],
      pmKisanId: 'TN/DGL/2023/84920',
      fpoMember: true,
    },
  },
  buyer_warehouse: {
    id: 'usr-buyer-02',
    name: 'Priya Sundaram (Apex Agro Hub)',
    role: 'buyer_warehouse',
    email: 'priya.sundaram@apexagro.in',
    phone: '+91 94432 19804',
    location: 'Oddanchatram Central Hub & Madurai Ring Road',
    verified: true,
    buyerWarehouseDetails: {
      entityType: 'Cold Storage Warehouse',
      gstin: '33AABCA8920K1ZX',
      warehouseCapacityMT: 2800,
      coldStorageTempZones: 'Multi-zone (2°C to 14°C Controlled RH)',
      apmcLicenseNo: 'APMC/DGL/W-4482',
    },
  },
  transport_owner: {
    id: 'usr-transport-03',
    name: 'Karthik Raja (Raja Agri Logistics)',
    role: 'transport_owner',
    email: 'karthik@rajaagrifleet.com',
    phone: '+91 97890 34512',
    location: 'Dindigul-Palani Highway Depot',
    verified: true,
    transportDetails: {
      companyName: 'Raja Agri Transport & Shared Freight Co.',
      fleetSize: 12,
      vehicleTypes: ['Tata Ace (1.2 Ton)', 'Mahindra Bolero Maxi (1.7 Ton)', 'Ashok Leyland Dost (2.5 Ton)', 'Eicher Pro 14ft (4 Ton)'],
      permitType: 'State Agricultural Permit',
      serviceTaluks: ['Dindigul', 'Oddanchatram', 'Palani', 'Vedasandur', 'Madurai'],
    },
  },
  admin: {
    id: 'usr-admin-04',
    name: 'Dr. A. Venkatesh (Chief Market Auditor)',
    role: 'admin',
    email: 'admin.venkatesh@farmflow.ai',
    phone: '+91 94422 00199',
    location: 'State Agri-Tech Directorate & FarmFlow NOC',
    verified: true,
    adminDetails: {
      department: 'Market Operations',
      accessLevel: 'Super Admin',
    },
  },
};

const AUTH_STORAGE_KEY = 'farmflow_auth_user';

export const getStoredUser = (): UserProfile => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // fallback
  }
  return DEMO_USERS.farmer;
};

export const saveStoredUser = (user: UserProfile) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    // Asynchronously synchronize with Supabase PostgreSQL cloud database
    syncUserProfileToSupabase(user).catch(() => {});
  } catch (e) {
    // fallback
  }
};
