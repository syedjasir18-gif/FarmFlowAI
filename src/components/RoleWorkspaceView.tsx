import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Warehouse, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Scale, 
  Clock, 
  Layers, 
  ThermometerSnowflake, 
  Fuel, 
  Activity, 
  FileText, 
  Wheat, 
  Calendar, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  PlusCircle, 
  BadgePercent, 
  RefreshCw,
  Send,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import { UserProfile, Language } from '../types';

interface RoleWorkspaceViewProps {
  user: UserProfile;
  language: Language;
  onNavigateToTab?: (tab: string) => void;
}

export const RoleWorkspaceView: React.FC<RoleWorkspaceViewProps> = ({ 
  user, 
  language,
  onNavigateToTab,
}) => {
  // Interactive state for Buyer lot approvals
  const [incomingLots, setIncomingLots] = useState([
    { id: 'LOT-TN-01', farmer: 'Murugan Karuppasamy', crop: 'Tomato (Grade A)', weight: '500 kg', pickup: 'Dindigul West', eta: '03:45 PM', status: 'In Transit', approved: false },
    { id: 'LOT-TN-02', farmer: 'Selvam P.', crop: 'Tomato (Hybrid)', weight: '300 kg', pickup: 'Palani Road', eta: '04:15 PM', status: 'Loading', approved: false },
    { id: 'LOT-TN-03', farmer: 'Arumugam V.', crop: 'Green Chilli', weight: '200 kg', pickup: 'Vedasandur', eta: '05:00 PM', status: 'Scheduled', approved: false },
  ]);

  // Interactive warehouse capacity
  const [warehouseOccupancyMT, setWarehouseOccupancyMT] = useState<number>(1820);
  const totalCapacityMT = user.buyerWarehouseDetails?.warehouseCapacityMT || 2800;

  // Interactive fleet dispatch status
  const [fleetTrips, setFleetTrips] = useState([
    { id: 'TRIP-1', route: 'Dindigul West ➔ Oddanchatram Central', vehicle: 'Tata Ace Gold (TN-57-AB-4412)', driver: 'Senthil Kumar', load: '1,150 kg (96% full)', farmersCount: 3, payout: '₹3,600', active: true },
    { id: 'TRIP-2', route: 'Reddiarchatram ➔ Madurai Mattuthavani', vehicle: 'Mahindra Bolero Maxi (TN-57-K-8921)', driver: 'Ramesh Velu', load: '1,620 kg (95% full)', farmersCount: 4, payout: '₹4,800', active: true },
    { id: 'TRIP-3', route: 'Palani Corridor ➔ Coimbatore Cluster', vehicle: 'Ashok Leyland Dost (TN-38-M-1102)', driver: 'K. Subramaniam', load: '2,350 kg (94% full)', farmersCount: 5, payout: '₹6,500', active: false },
  ]);

  // Admin Agmarknet sync trigger state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now (12:40 PM)');

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  const handleApproveLot = (id: string) => {
    setIncomingLots((prev) => 
      prev.map((lot) => lot.id === id ? { ...lot, approved: true, status: 'Intake Verified' } : lot)
    );
  };

  const getRoleHeader = () => {
    switch (user.role) {
      case 'farmer':
        return {
          badge: 'Farmer / Producer Operations Console',
          title: `${user.name}'s Farm Gate Terminal`,
          subtitle: `${user.location} • PM-Kisan ID: ${user.farmDetails?.pmKisanId || 'Verified'} • FPO Active`,
          icon: Wheat,
          color: 'emerald',
        };
      case 'buyer_warehouse':
        return {
          badge: 'Buyer & Cold Chain Storage Console',
          title: user.buyerWarehouseDetails?.entityType || 'Commercial Warehouse Hub',
          subtitle: `${user.location} • GSTIN: ${user.buyerWarehouseDetails?.gstin || 'Active'} • APMC Licensed`,
          icon: Warehouse,
          color: 'blue',
        };
      case 'transport_owner':
        return {
          badge: 'Transport Fleet Operations Console',
          title: user.transportDetails?.companyName || 'Agri Logistics Fleet Operator',
          subtitle: `${user.location} • ${user.transportDetails?.fleetSize || 12} Commercial Vehicles Active`,
          icon: Truck,
          color: 'amber',
        };
      case 'admin':
        return {
          badge: 'Platform Super Admin & Regulatory NOC',
          title: 'State Agricultural Market Intelligence Node',
          subtitle: 'Live Agmarknet & e-NAM Feed Sync • Bayesian Model Learning Engine',
          icon: ShieldCheck,
          color: 'indigo',
        };
    }
  };

  const headerInfo = getRoleHeader();
  const HeaderIcon = headerInfo.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      
      {/* Role Banner Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' :
                user.role === 'buyer_warehouse' ? 'bg-blue-100 text-blue-800' :
                user.role === 'transport_owner' ? 'bg-amber-100 text-amber-800' :
                'bg-indigo-100 text-indigo-800'
              }`}>
                {headerInfo.badge}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Active Stakeholder: {user.name}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 flex items-center space-x-2">
              <HeaderIcon className={`w-6 h-6 ${
                user.role === 'farmer' ? 'text-emerald-700' :
                user.role === 'buyer_warehouse' ? 'text-blue-700' :
                user.role === 'transport_owner' ? 'text-amber-700' :
                'text-indigo-700'
              }`} />
              <span>{headerInfo.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              {headerInfo.subtitle}
            </p>
          </div>

          <div className="shrink-0 bg-stone-50 border border-stone-200 p-3 rounded-2xl text-center min-w-[170px]">
            <div className="text-[10px] text-stone-500 font-bold uppercase">Digital Escrow & KYC</div>
            <div className="text-sm font-extrabold text-emerald-700 flex items-center justify-center mt-0.5">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
              100% Verified Account
            </div>
          </div>
        </div>
      </div>

      {/* --- VIEW 1: FARMER / PRODUCER OPERATIONS CONSOLE --- */}
      {user.role === 'farmer' && (
        <div className="space-y-6">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Cultivated Land</span>
                <Wheat className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">
                {user.farmDetails?.landAcres || 4.5} Acres
              </div>
              <div className="text-[11px] text-emerald-700 font-medium pt-1">
                Drip irrigated • 3 Active crops
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Ready for Harvest</span>
                <Scale className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-800 font-mono">
                500 kg Tomato
              </div>
              <div className="text-[11px] text-stone-500 pt-1">
                Firm Grade A • Needs dispatch today
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Shared Transport Saved</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                ₹4,200 Total
              </div>
              <div className="text-[11px] text-emerald-800 font-medium pt-1">
                Avg. ₹1,000 saved per trip
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>DBT Escrow Payouts</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">
                ₹64,800
              </div>
              <div className="text-[11px] text-stone-500 pt-1">
                T+1 Day direct to bank account
              </div>
            </div>
          </div>

          {/* Harvest Lots Table with 1-Click Launch to Intelligence Engines */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-stone-900">Your Registered Farm Lots & Dispatches</h4>
                <p className="text-xs text-stone-500">
                  Track produce status from harvest to mandi auction or direct institutional delivery.
                </p>
              </div>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('net_realization')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Calculate True Net Realization</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {[
                { 
                  lot: 'LOT-2026-TOM-01', 
                  crop: 'Tomato (Grade A Firm)', 
                  qty: '500 kg', 
                  stage: 'Harvested Today', 
                  action: 'Ready to Dispatch', 
                  recommendation: 'Sell at Oddanchatram or Direct Buyer', 
                  actionTab: 'net_realization' 
                },
                { 
                  lot: 'LOT-2026-ONI-02', 
                  crop: 'Bellary Onion (Small Red)', 
                  qty: '1,200 kg', 
                  stage: 'Maturing in 8 Days', 
                  action: 'Cold Storage Holding', 
                  recommendation: 'Pre-book Apex Cold Room at ₹18/day/quintal', 
                  actionTab: 'forecasting' 
                },
                { 
                  lot: 'LOT-2026-CHI-03', 
                  crop: 'Green Chilli (G4 Teja)', 
                  qty: '200 kg', 
                  stage: 'Harvest in 2 Days', 
                  action: 'Shared Pool Matched', 
                  recommendation: 'Grouped with Farmer Arumugam (Save ₹1,000)', 
                  actionTab: 'shared_transport' 
                },
              ].map((item, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-stone-800">{item.lot}</span>
                      <span className="text-stone-300">•</span>
                      <span className="font-bold text-stone-900 text-sm">{item.crop}</span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 font-mono font-semibold text-stone-700">
                        {item.qty}
                      </span>
                    </div>
                    <div className="text-stone-500 text-xs flex items-center space-x-1.5">
                      <span>Status: <strong className="text-emerald-700">{item.stage}</strong></span>
                      <span className="text-stone-300">|</span>
                      <span>AI Advisory: <em>{item.recommendation}</em></span>
                    </div>
                  </div>

                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab(item.actionTab)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-bold transition-all shrink-0"
                    >
                      <span>{item.action}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- VIEW 2: BUYER & WAREHOUSE CONSOLE --- */}
      {user.role === 'buyer_warehouse' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Warehouse Capacity Utilization</span>
                <Warehouse className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">
                {warehouseOccupancyMT} / {totalCapacityMT} MT
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((warehouseOccupancyMT / totalCapacityMT) * 100)}%` }} 
                />
              </div>
              <div className="text-[11px] text-stone-500 pt-1 flex justify-between">
                <span>{Math.round((warehouseOccupancyMT / totalCapacityMT) * 100)}% Occupied</span>
                <span className="font-semibold text-blue-700">{totalCapacityMT - warehouseOccupancyMT} MT Free</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Active Direct Farmer Contracts</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">18 Active Lots</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-2">
                12 Tons scheduled for delivery today
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Cold Storage Climate Zones</span>
                <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">3.8°C / 85% RH</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-2">
                Optimal for Tomato & Horticultural storage
              </div>
            </div>
          </div>

          {/* Incoming Lots Intake & Quality Assaying */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-stone-900">Incoming Farmer Lots Awaiting Intake & Assaying</h4>
                <p className="text-xs text-stone-500">
                  Inspect incoming loads, verify quality dockage percentages, and release escrow payments.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800">
                {incomingLots.filter(l => !l.approved).length} Pending Gate Arrival
              </span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {incomingLots.map((row) => (
                <div key={row.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900 text-sm">{row.farmer}</span>
                      <span className="text-stone-300">•</span>
                      <span className="font-mono text-stone-500">{row.id}</span>
                    </div>
                    <div className="text-stone-600 mt-0.5">
                      {row.crop} <span className="font-mono font-bold text-stone-800">({row.weight})</span>
                      <span className="text-stone-400 mx-1.5">•</span>
                      <span className="text-stone-400">Route: {row.pickup} ➔ Central Hub</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-stone-600 font-mono font-semibold">ETA: {row.eta}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      row.approved 
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}>
                      {row.status}
                    </span>

                    {!row.approved ? (
                      <button
                        onClick={() => handleApproveLot(row.id)}
                        className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center space-x-1"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Verify & Approve</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center text-xs">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Gate Pass Cleared
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- VIEW 3: TRANSPORT FLEET OWNER CONSOLE --- */}
      {user.role === 'transport_owner' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Active Commercial Fleet</span>
                <Truck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">12 Vehicles</div>
              <div className="text-[11px] text-stone-500 mt-2">8 on Active Corridor Trips, 4 Standby</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Today's Total Consolidated Payload</span>
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">9.4 Tons</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-2">
                Average Vehicle Fill Rate: 91.2%
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Diesel Efficiency & Fleet Earnings</span>
                <Fuel className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">₹28,400 Gross</div>
              <div className="text-[11px] text-stone-500 mt-2">
                Fuel Cost: ₹11,200 | Net Operating Margin: 60.5%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-stone-900">Active Shared Vehicle Trips Today</h4>
                <p className="text-xs text-stone-500">
                  Real-time GPS waypoints and multi-farmer pickup consolidation schedules.
                </p>
              </div>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('shared_transport')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Open Shared Transport Optimizer</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {fleetTrips.map((trip) => (
                <div key={trip.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900 text-sm">{trip.route}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {trip.farmersCount} Farmers Pooled
                      </span>
                    </div>
                    <div className="text-stone-500 text-xs mt-1">
                      {trip.vehicle} • Pilot: <strong className="text-stone-700">{trip.driver}</strong>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-stone-700">{trip.load}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold font-mono text-sm">
                      {trip.payout}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- VIEW 4: PLATFORM ADMIN & REGULATORY NOC CONSOLE --- */}
      {user.role === 'admin' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
              <div className="text-stone-500 font-semibold">e-NAM & Agmarknet Feeds</div>
              <div className="text-xl font-extrabold text-emerald-800 font-mono mt-1">Operational</div>
              <div className="text-[10px] text-emerald-700 mt-1">42 APMC mandis synced live</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
              <div className="text-stone-500 font-semibold">Regional Bayesian Accuracy</div>
              <div className="text-xl font-extrabold text-stone-900 font-mono mt-1">97.8% Mean</div>
              <div className="text-[10px] text-stone-500 mt-1">142 verified sale receipts</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
              <div className="text-stone-500 font-semibold">Active Pooling Corridors</div>
              <div className="text-xl font-extrabold text-stone-900 font-mono mt-1">6 Corridors</div>
              <div className="text-[10px] text-stone-500 mt-1">₹1,000 avg farmer trip saving</div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
              <div className="text-stone-500 font-semibold">Escrow Settlement Speed</div>
              <div className="text-xl font-extrabold text-emerald-800 font-mono mt-1">T+1 Day</div>
              <div className="text-[10px] text-emerald-700 mt-1">Zero unresolved disputes</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-stone-900">System Telemetry & Live Data Feed Health</h4>
                <p className="text-xs text-stone-500">
                  Sync status across Agmarknet arrival feeds, e-NAM digital auctions, and Gemini 3.8 advisory services.
                </p>
              </div>

              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Agmarknet Feeds'}</span>
              </button>
            </div>

            <div className="text-xs space-y-2.5 text-stone-600">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                <span>Oddanchatram Evening Auction WebSocket Pipe</span>
                <span className="font-mono text-emerald-700 font-bold">12ms Latency (Healthy)</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                <span>Madurai Mattuthavani Wholesale Mandi Ingress</span>
                <span className="font-mono text-emerald-700 font-bold">Synced {lastSyncTime}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                <span>Pest-Trap IoT LoRaWAN Gateways (Dindigul Pilot)</span>
                <span className="font-mono text-emerald-700 font-bold">18 of 18 Online</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex justify-between items-center">
                <span>Gemini 3.8 Flash Server-Side Agri Advisory Model</span>
                <span className="font-mono text-emerald-700 font-bold">Operational & Active</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </motion.div>
  );
};
