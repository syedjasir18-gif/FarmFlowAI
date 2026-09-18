import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  Database, 
  CreditCard, 
  ShieldCheck, 
  Building2, 
  Truck, 
  Layers, 
  Check, 
  Copy, 
  X, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  Zap, 
  Lock, 
  Scale, 
  Wheat, 
  Warehouse,
  Coins,
  Receipt
} from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface CommercialModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommercialModelModal: React.FC<CommercialModelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'calculator' | 'supabase' | 'subscriptions'>('revenue');
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  // Revenue Calculator Interactive State
  const [dailyDispatches, setDailyDispatches] = useState<number>(120);
  const [avgLotValue, setAvgLotValue] = useState<number>(28000); // ₹28,000 avg lot
  const [dailyTrips, setDailyTrips] = useState<number>(18);
  const [activeWarehouses, setActiveWarehouses] = useState<number>(12);

  // Calculations
  const transactionCommissionMonthly = Math.round(dailyDispatches * avgLotValue * 0.015 * 30); // 1.5% take rate
  const transportBookingFeeMonthly = dailyTrips * 4 * 60 * 30; // 4 farmers/trip * ₹60 * 30 days
  const warehouseSaaSMonthly = activeWarehouses * 2499; // ₹2,499/mo per warehouse
  const totalMonthlyEarnings = transactionCommissionMonthly + transportBookingFeeMonthly + warehouseSaaSMonthly;
  const totalAnnualEarnings = totalMonthlyEarnings * 12;

  const handleCopySchema = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA.trim());
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        >
          
          {/* Header */}
          <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Commercial Enterprise Engine
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  FarmFlow Production Architecture
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-stone-100 flex items-center space-x-2">
                <Coins className="w-6 h-6 text-emerald-400" />
                <span>Monetization & Database Infrastructure</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 space-x-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'revenue', label: 'Revenue Streams', icon: DollarSign },
              { id: 'calculator', label: 'Earnings Calculator', icon: BarChart3 },
              { id: 'subscriptions', label: 'SaaS Tiers & Pricing', icon: CreditCard },
              { id: 'supabase', label: 'Supabase Database', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-t border-x ${
                    isActive
                      ? 'bg-white border-stone-200 text-emerald-800 shadow-2xs -mb-px'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-700">
            
            {/* 1. REVENUE STREAMS TAB */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-heading">
                    How FarmFlow Generates Sustainable Commercial Revenue
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Unlike advertising-dependent consumer apps, FarmFlow operates as a high-margin transactional enablement platform with multiple compounding revenue streams:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                      1.5%
                    </div>
                    <div className="font-bold text-stone-900 text-base">
                      Transaction Take-Rate
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Earn 1.5% on all direct wholesale and institutional farmer transactions routed through the guaranteed digital escrow settlement engine.
                    </p>
                    <div className="pt-2 text-[11px] font-bold text-emerald-800">
                      Average: ₹420 - ₹750 per lot
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
                      ₹60
                    </div>
                    <div className="font-bold text-stone-900 text-base">
                      Shared Freight Fee
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Convenience coordination charge per farmer for matching into multi-farmer corridor vehicles (saving each farmer ₹800–₹1,400 per trip).
                    </p>
                    <div className="pt-2 text-[11px] font-bold text-amber-900">
                      Average: ₹240/trip (4 farmers)
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold">
                      SaaS
                    </div>
                    <div className="font-bold text-stone-900 text-base">
                      Warehouse & Fleet Hub
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Monthly software license for commercial cold storage operators (capacity management) and transport fleet agencies (corridor optimization).
                    </p>
                    <div className="pt-2 text-[11px] font-bold text-blue-900">
                      ₹799 to ₹2,499 / facility / month
                    </div>
                  </div>

                </div>

                <div className="p-5 rounded-3xl bg-stone-900 text-white space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    <Receipt className="w-4 h-4" />
                    <span>Real-World Transaction Example</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-stone-400">Produce Volume</div>
                      <div className="font-bold text-base text-stone-100 font-mono mt-0.5">1,500 kg Tomato</div>
                    </div>
                    <div>
                      <div className="text-stone-400">Gross Realized Value</div>
                      <div className="font-bold text-base text-emerald-400 font-mono mt-0.5">₹48,000</div>
                    </div>
                    <div>
                      <div className="text-stone-400">Logistics & Handling</div>
                      <div className="font-bold text-base text-stone-100 font-mono mt-0.5">₹1,800</div>
                    </div>
                    <div>
                      <div className="text-stone-400">Platform Take (1.5%)</div>
                      <div className="font-bold text-base text-emerald-300 font-mono mt-0.5">₹720 Net</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CALCULATOR TAB */}
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-heading">
                    Interactive Platform Revenue Projection Calculator
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Adjust the operational volume parameters below to model monthly and annual platform earnings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50 p-6 rounded-3xl border border-stone-200">
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                        <span>Daily Transacted Produce Lots</span>
                        <span className="font-mono text-emerald-800">{dailyDispatches} Lots / Day</span>
                      </div>
                      <input 
                        type="range"
                        min="20"
                        max="500"
                        step="10"
                        value={dailyDispatches}
                        onChange={(e) => setDailyDispatches(Number(e.target.value))}
                        className="w-full accent-emerald-700"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                        <span>Average Gross Consignment Value</span>
                        <span className="font-mono text-emerald-800">₹{avgLotValue.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range"
                        min="10000"
                        max="100000"
                        step="2000"
                        value={avgLotValue}
                        onChange={(e) => setAvgLotValue(Number(e.target.value))}
                        className="w-full accent-emerald-700"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                        <span>Daily Pooled Transport Trips</span>
                        <span className="font-mono text-amber-800">{dailyTrips} Trips / Day</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="80"
                        step="1"
                        value={dailyTrips}
                        onChange={(e) => setDailyTrips(Number(e.target.value))}
                        className="w-full accent-amber-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                        <span>Subscribed Cold Storage Warehouses</span>
                        <span className="font-mono text-blue-800">{activeWarehouses} Facilities</span>
                      </div>
                      <input 
                        type="range"
                        min="2"
                        max="50"
                        step="1"
                        value={activeWarehouses}
                        onChange={(e) => setActiveWarehouses(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Earnings Output Card */}
                  <div className="p-6 rounded-3xl bg-stone-900 text-white flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Projected Monthly Earnings
                      </div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                        ₹{totalMonthlyEarnings.toLocaleString()}
                      </div>
                      <div className="text-xs text-stone-300 space-y-1 pt-2 border-t border-stone-800 font-mono">
                        <div className="flex justify-between">
                          <span className="text-stone-400">1.5% Escrow Commissions:</span>
                          <span className="text-stone-100">₹{transactionCommissionMonthly.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Freight Pool Fees:</span>
                          <span className="text-stone-100">₹{transportBookingFeeMonthly.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Warehouse Subscriptions:</span>
                          <span className="text-stone-100">₹{warehouseSaaSMonthly.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800">
                      <div className="text-[11px] text-stone-400">Annualized Recurring Revenue (ARR)</div>
                      <div className="text-xl font-bold font-mono text-emerald-300">
                        ₹{(totalAnnualEarnings / 100000).toFixed(2)} Lakhs / year
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 3. SUBSCRIPTIONS TAB */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-heading">
                    Platform SaaS Subscription Tiers
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Clear monetization plans tailored for each segment of the agricultural supply chain.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  
                  {/* Tier 1 */}
                  <div className="p-4 rounded-3xl border border-stone-200 bg-white space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        Individual Farmer
                      </span>
                      <div className="text-xl font-extrabold text-stone-900">₹0 Free</div>
                      <p className="text-[11px] text-stone-500">
                        Free forever for smallholder farmers with under 5 acres.
                      </p>
                      <ul className="text-xs space-y-1.5 text-stone-600 pt-2">
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Mandi Spot Quotes</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Basic Net Realization</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Shared Transport Booking</span>
                        </li>
                      </ul>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold">
                      Current Plan
                    </button>
                  </div>

                  {/* Tier 2 */}
                  <div className="p-4 rounded-3xl border border-emerald-500 bg-emerald-50/30 space-y-3 flex flex-col justify-between relative shadow-xs">
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                        FPO / Kisan Pro
                      </span>
                      <div className="text-xl font-extrabold text-stone-900">₹499 <span className="text-xs font-normal text-stone-500">/mo</span></div>
                      <p className="text-[11px] text-stone-500">
                        Designed for Farmer Producer Orgs and commercial growers.
                      </p>
                      <ul className="text-xs space-y-1.5 text-stone-600 pt-2">
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>7-Day Bayesian Price Forecast</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>SMS Alert Broadcasts</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Priority Shared Vehicle Match</span>
                        </li>
                      </ul>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors">
                      Upgrade to Pro
                    </button>
                  </div>

                  {/* Tier 3 */}
                  <div className="p-4 rounded-3xl border border-amber-300 bg-amber-50/30 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                        Fleet Operator
                      </span>
                      <div className="text-xl font-extrabold text-stone-900">₹799 <span className="text-xs font-normal text-stone-500">/mo</span></div>
                      <p className="text-[11px] text-stone-500">
                        For commercial transport owners & logistics coordinators.
                      </p>
                      <ul className="text-xs space-y-1.5 text-stone-600 pt-2">
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Corridor Load Aggregation</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>90%+ Payload Guarantee</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Instant Diesel Payouts</span>
                        </li>
                      </ul>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors">
                      Subscribe Fleet
                    </button>
                  </div>

                  {/* Tier 4 */}
                  <div className="p-4 rounded-3xl border border-blue-300 bg-blue-50/30 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-700 text-white">
                        Enterprise Buyer / Hub
                      </span>
                      <div className="text-xl font-extrabold text-stone-900">₹2,499 <span className="text-xs font-normal text-stone-500">/mo</span></div>
                      <p className="text-[11px] text-stone-500">
                        Cold storage warehouses, food processors, retail chains.
                      </p>
                      <ul className="text-xs space-y-1.5 text-stone-600 pt-2">
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Direct Procurement Channel</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Quality Assaying Gateway</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Digital Escrow Clearance</span>
                        </li>
                      </ul>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors">
                      Enterprise Access
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 4. SUPABASE DATABASE TAB */}
            {activeTab === 'supabase' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 font-heading">
                      Supabase Cloud Database Configuration
                    </h3>
                    <p className="text-xs text-stone-500">
                      Production PostgreSQL schema with Row Level Security (RLS) and verified tables.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                      isSupabaseConfigured 
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                      <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Fallback Ready'}</span>
                    </div>
                    <button
                      onClick={handleCopySchema}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                  <div className="font-bold text-stone-800">Quick 2-Step Supabase Deployment:</div>
                  <ol className="list-decimal list-inside space-y-1 text-stone-600">
                    <li>Create a project on <strong>supabase.com</strong>, go to the <strong>SQL Editor</strong>, paste the schema below, and click <strong>Run</strong>.</li>
                    <li>Add your project credentials (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) to your environment or Settings Secrets panel.</li>
                  </ol>
                </div>

                <div className="relative">
                  <pre className="bg-stone-950 text-stone-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-64 border border-stone-800">
                    <code>{SUPABASE_SQL_SCHEMA.trim()}</code>
                  </pre>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Full compliance with APMC Model Acts, WDRA Warehousing, & RBI Digital Payment Guidelines.</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs"
            >
              Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
