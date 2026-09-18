import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Building2, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Wheat, 
  Warehouse, 
  FileText,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { DEMO_USERS, saveStoredUser } from '../data/authData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Common Form Fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('demo1234');
  const [location, setLocation] = useState<string>('Dindigul West, Tamil Nadu');

  // Farmer specific fields
  const [landAcres, setLandAcres] = useState<number>(4.5);
  const [primaryCrops, setPrimaryCrops] = useState<string>('Tomato, Onion, Green Chilli');
  const [pmKisanId, setPmKisanId] = useState<string>('TN/DGL/2023/84920');

  // Buyer & Warehouse specific fields
  const [entityType, setEntityType] = useState<'Institutional Buyer' | 'Wholesale Trader' | 'Cold Storage Warehouse' | 'Food Processor'>('Cold Storage Warehouse');
  const [gstin, setGstin] = useState<string>('33AABCA8920K1ZX');
  const [apmcLicense, setApmcLicense] = useState<string>('APMC/DGL/W-4482');
  const [warehouseCapacityMT, setWarehouseCapacityMT] = useState<number>(2500);

  // Transport Owner specific fields
  const [companyName, setCompanyName] = useState<string>('Raja Agri Logistics Fleet');
  const [fleetSize, setFleetSize] = useState<number>(8);
  const [permitType, setPermitType] = useState<'State Agricultural Permit' | 'All India Permit'>('State Agricultural Permit');

  // Admin specific fields
  const [adminPasscode, setAdminPasscode] = useState<string>('ADMIN-AGRI-2026');

  if (!isOpen) return null;

  const roleMeta = {
    farmer: {
      title: 'Farmer Portal',
      subtitle: 'Crop Sellers & Agricultural Producers',
      icon: Wheat,
      color: 'emerald',
    },
    buyer_warehouse: {
      title: 'Buyer & Warehouse Portal',
      subtitle: 'Wholesalers, Institutional Buyers & Cold Storages',
      icon: Warehouse,
      color: 'blue',
    },
    transport_owner: {
      title: 'Transport Owner Portal',
      subtitle: 'Commercial Vehicle Owners & Logistics Operators',
      icon: Truck,
      color: 'amber',
    },
    admin: {
      title: 'Platform Admin Portal',
      subtitle: 'Market Regulators & System Directors',
      icon: ShieldCheck,
      color: 'indigo',
    },
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const demoProfile = DEMO_USERS[role];
    saveStoredUser(demoProfile);
    onLoginSuccess(demoProfile);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      handleQuickDemoLogin(selectedRole);
    } else {
      // Register custom profile
      const newProfile: UserProfile = {
        id: `usr-${selectedRole}-${Date.now()}`,
        name: name || (selectedRole === 'farmer' ? 'New Farmer User' : selectedRole === 'buyer_warehouse' ? 'New Buyer/Warehouse' : selectedRole === 'transport_owner' ? 'New Transport Operator' : 'Admin Auditor'),
        role: selectedRole,
        email: email || `${selectedRole}@farmflow.ai`,
        phone: phone || '+91 98421 00000',
        location: location || 'Dindigul, Tamil Nadu',
        verified: true,
        farmDetails: selectedRole === 'farmer' ? {
          landAcres,
          primaryCrops: primaryCrops.split(',').map((s) => s.trim()),
          pmKisanId,
          fpoMember: true,
        } : undefined,
        buyerWarehouseDetails: selectedRole === 'buyer_warehouse' ? {
          entityType,
          gstin,
          warehouseCapacityMT,
          coldStorageTempZones: 'Multi-zone 2°C - 12°C',
          apmcLicenseNo: apmcLicense,
        } : undefined,
        transportDetails: selectedRole === 'transport_owner' ? {
          companyName,
          fleetSize,
          vehicleTypes: ['Tata Ace', 'Bolero Maxi Truck', 'Ashok Leyland Dost'],
          permitType,
          serviceTaluks: ['Dindigul', 'Oddanchatram', 'Palani'],
        } : undefined,
        adminDetails: selectedRole === 'admin' ? {
          department: 'Market Operations',
          accessLevel: 'Super Admin',
        } : undefined,
      };

      saveStoredUser(newProfile);
      onLoginSuccess(newProfile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 my-8 max-h-[92vh] overflow-y-auto"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              FarmFlow AI Multi-Role Access
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 mt-1">
              {authMode === 'login' ? 'Sign In to Your Workspace' : 'Create Dedicated Account'}
            </h3>
            <p className="text-xs text-stone-500">
              Separate portals for Farmers, Buyers/Warehouses, Transport Fleet Owners, and Admin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Separate Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
            Select Your Role & Portal:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['farmer', 'buyer_warehouse', 'transport_owner', 'admin'] as UserRole[]).map((role) => {
              const meta = roleMeta[role];
              const Icon = meta.icon;
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-white text-stone-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-emerald-700' : 'text-stone-500'}`} />
                  <div className="font-bold text-xs truncate">{meta.title.replace(' Portal', '')}</div>
                  <div className="text-[10px] text-stone-500 truncate mt-0.5">{meta.subtitle.split(',')[0]}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Mode Toggle: Login vs Register */}
        <div className="flex bg-stone-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              authMode === 'login' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
            }`}
          >
            Log In ({roleMeta[selectedRole].title.split(' ')[0]})
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              authMode === 'register' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
            }`}
          >
            Register ({roleMeta[selectedRole].title.split(' ')[0]})
          </button>
        </div>

        {/* 1-Click Demo Login Banner (Super fast demo testing for users and judges) */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-amber-950">
              Instant Demo Access for <strong>{roleMeta[selectedRole].title}</strong>:
            </span>
          </div>
          <button
            type="button"
            id={`btn-quick-demo-login-${selectedRole}`}
            onClick={() => handleQuickDemoLogin(selectedRole)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-xs transition-colors shrink-0"
          >
            Quick 1-Click Demo
          </button>
        </div>

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Registration specific fields */}
          {authMode === 'register' && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {selectedRole === 'farmer' ? 'Farmer Full Name' : selectedRole === 'buyer_warehouse' ? 'Contact Person Name' : selectedRole === 'transport_owner' ? 'Fleet Operator Name' : 'Admin Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Location / Taluk</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              {/* Role-Specific Registration Fields */}
              {selectedRole === 'farmer' && (
                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-2.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Farmer Farm Details:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Land Size (Acres)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={landAcres}
                        onChange={(e) => setLandAcres(Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Primary Crops Grown</label>
                      <input
                        type="text"
                        value={primaryCrops}
                        onChange={(e) => setPrimaryCrops(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">PM-Kisan ID (Optional)</label>
                      <input
                        type="text"
                        value={pmKisanId}
                        onChange={(e) => setPmKisanId(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'buyer_warehouse' && (
                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 space-y-2.5">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    Buyer & Warehouse Commercial Details:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Entity Type</label>
                      <select
                        value={entityType}
                        onChange={(e) => setEntityType(e.target.value as any)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      >
                        <option value="Cold Storage Warehouse">Cold Storage Warehouse Operator</option>
                        <option value="Institutional Buyer">Institutional Retail Chain Procurer</option>
                        <option value="Wholesale Trader">APMC Licensed Mandi Trader</option>
                        <option value="Food Processor">Agri Food Processing Plant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Warehouse Capacity (MT)</label>
                      <input
                        type="number"
                        value={warehouseCapacityMT}
                        onChange={(e) => setWarehouseCapacityMT(Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">APMC License Number</label>
                      <input
                        type="text"
                        value={apmcLicense}
                        onChange={(e) => setApmcLicense(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'transport_owner' && (
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-2.5">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Transport Fleet & Vehicle Fleet Details:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Company / Fleet Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Fleet Size (Vehicles)</label>
                      <input
                        type="number"
                        value={fleetSize}
                        onChange={(e) => setFleetSize(Number(e.target.value))}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Permit Type</label>
                      <select
                        value={permitType}
                        onChange={(e) => setPermitType(e.target.value as any)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium"
                      >
                        <option value="State Agricultural Permit">State Agricultural Permit</option>
                        <option value="All India Permit">All India Permit</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200 space-y-2.5">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                    Administrator Security Verification:
                  </span>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Admin Authorization Code</label>
                    <input
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg p-2 font-medium font-mono"
                    />
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Email / Phone / Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {authMode === 'login' ? 'Email or Mobile Number' : 'Official Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={DEMO_USERS[selectedRole].email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-9 pr-3 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-9 pr-3 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-md flex items-center justify-center space-x-2 active:scale-98"
          >
            <span>
              {authMode === 'login'
                ? `Log In to ${roleMeta[selectedRole].title}`
                : `Complete ${roleMeta[selectedRole].title} Registration`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </motion.div>
    </div>
  );
};
