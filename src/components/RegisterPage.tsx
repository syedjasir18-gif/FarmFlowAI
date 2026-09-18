import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wheat, 
  Warehouse, 
  Truck, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Building2, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Shield, 
  Zap, 
  ArrowLeft,
  Scale,
  ThermometerSnowflake,
  Fuel,
  Check
} from 'lucide-react';
import { UserRole, UserProfile, Language } from '../types';
import { DEMO_USERS, saveStoredUser } from '../data/authData';

interface RegisterPageProps {
  language: Language;
  initialRole?: UserRole;
  onRegisterSuccess: (user: UserProfile) => void;
  onNavigateToLogin: (initialRole?: UserRole) => void;
  onBackToApp: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  language,
  initialRole = 'farmer',
  onRegisterSuccess,
  onNavigateToLogin,
  onBackToApp,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // Common User Info
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [locationTaluk, setLocationTaluk] = useState<string>('Dindigul West, Tamil Nadu');
  const [password, setPassword] = useState<string>('AgriFlow@2026');

  // 1. Farmer Specific Registration Fields
  const [landAcres, setLandAcres] = useState<number>(3.5);
  const [primaryCrops, setPrimaryCrops] = useState<string>('Tomato, Onion, Green Chilli');
  const [pmKisanId, setPmKisanId] = useState<string>('TN/DGL/2024/77102');
  const [isFpoMember, setIsFpoMember] = useState<boolean>(true);
  const [fpoName, setFpoName] = useState<string>('Dindigul Horticultural Farmers Producer Co.');
  const [irrigationType, setIrrigationType] = useState<'Drip Irrigation' | 'Canal/Well' | 'Rainfed'>('Drip Irrigation');

  // 2. Buyer & Warehouse Specific Fields
  const [companyName, setCompanyName] = useState<string>('Kaveri Agro Logistics & Cold Storage');
  const [entityType, setEntityType] = useState<'Cold Storage Warehouse' | 'Institutional Buyer' | 'Wholesale Trader' | 'Food Processor'>('Cold Storage Warehouse');
  const [gstin, setGstin] = useState<string>('33AAACK9012M1Z5');
  const [apmcLicense, setApmcLicense] = useState<string>('APMC/TN/DGL/W-9102');
  const [warehouseCapacityMT, setWarehouseCapacityMT] = useState<number>(3200);
  const [tempRange, setTempRange] = useState<string>('2°C to 12°C Controlled RH');

  // 3. Transport Fleet Specific Fields
  const [transportAgencyName, setTransportAgencyName] = useState<string>('Marudham Rural Agri Logistics');
  const [fleetCount, setFleetCount] = useState<number>(6);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([
    'Tata Ace Gold (1.2 Ton)',
    'Mahindra Bolero Maxi (1.7 Ton)',
    'Ashok Leyland Dost (2.5 Ton)'
  ]);
  const [permitType, setPermitType] = useState<'State Agricultural Permit' | 'All India Permit'>('State Agricultural Permit');
  const [baseServiceTaluks, setBaseServiceTaluks] = useState<string>('Dindigul, Oddanchatram, Palani, Vedasandur');

  // 4. Admin Specific Fields
  const [department, setDepartment] = useState<'Market Operations' | 'Price Intelligence' | 'Platform Security'>('Price Intelligence');
  const [employeeId, setEmployeeId] = useState<string>('GOVT-TN-AGRI-4019');
  const [accessPasscode, setAccessPasscode] = useState<string>('TN-MARKET-DIRECTORATE-2026');

  const rolesConfig: {
    role: UserRole;
    title: string;
    subtitle: string;
    icon: typeof Wheat;
    badge: string;
    description: string;
  }[] = [
    {
      role: 'farmer',
      title: 'Farmer Registration',
      subtitle: 'Kisan Onboarding & Direct FPO Linking',
      icon: Wheat,
      badge: 'Zero Middleman',
      description: 'Access pre-dispatch mandi comparisons, save 40%+ on shared transport freight, and get AI price forecasts.',
    },
    {
      role: 'buyer_warehouse',
      title: 'Buyer & Warehouse Registration',
      subtitle: 'Cold Chain Operators & Agri Wholesalers',
      icon: Warehouse,
      badge: 'Licensed Buyer',
      description: 'Source quality-graded farm lots directly, utilize cold storage capacity, and lock forward supply contracts.',
    },
    {
      role: 'transport_owner',
      title: 'Transport Fleet Registration',
      subtitle: 'Commercial Vehicle Owners & Logistics',
      icon: Truck,
      badge: 'Guaranteed Freight',
      description: 'Fill vehicle capacity above 90% via automated corridor aggregation and receive guaranteed daily payouts.',
    },
    {
      role: 'admin',
      title: 'Admin / Auditor Registration',
      subtitle: 'Market Regulators & Price Intelligence NOC',
      icon: ShieldCheck,
      badge: 'State Governance',
      description: 'Monitor e-NAM/Agmarknet market telemetry, arbitrate dispute records, and audit algorithm accuracy.',
    },
  ];

  const currentRole = rolesConfig.find((r) => r.role === selectedRole) || rolesConfig[0];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newProfile: UserProfile = {
        id: `usr-${selectedRole}-${Date.now().toString().slice(-5)}`,
        name: fullName || (selectedRole === 'farmer' ? 'Selvam Karuppiah' : selectedRole === 'buyer_warehouse' ? companyName : selectedRole === 'transport_owner' ? transportAgencyName : 'Market Director'),
        role: selectedRole,
        email: emailAddress || `${selectedRole}@farmflow.ai`,
        phone: mobileNumber ? `+91 ${mobileNumber}` : '+91 98421 87210',
        location: locationTaluk || 'Dindigul, Tamil Nadu',
        verified: true,
        farmDetails: selectedRole === 'farmer' ? {
          landAcres,
          primaryCrops: primaryCrops.split(',').map((c) => c.trim()),
          pmKisanId,
          fpoMember: isFpoMember,
        } : undefined,
        buyerWarehouseDetails: selectedRole === 'buyer_warehouse' ? {
          entityType,
          gstin,
          warehouseCapacityMT,
          coldStorageTempZones: tempRange,
          apmcLicenseNo: apmcLicense,
        } : undefined,
        transportDetails: selectedRole === 'transport_owner' ? {
          companyName: transportAgencyName,
          fleetSize: fleetCount,
          vehicleTypes,
          permitType,
          serviceTaluks: baseServiceTaluks.split(',').map((s) => s.trim()),
        } : undefined,
        adminDetails: selectedRole === 'admin' ? {
          department,
          accessLevel: 'Super Admin',
        } : undefined,
      };

      saveStoredUser(newProfile);
      onRegisterSuccess(newProfile);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToApp}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-700 transition-colors group"
        >
          <div className="p-1.5 rounded-xl bg-white border border-stone-200 group-hover:border-emerald-300 shadow-2xs">
            <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:text-emerald-700" />
          </div>
          <span>Back to FarmFlow Intelligence Suite</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-stone-500">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>NABARD & e-NAM Verified Digital Onboarding</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200"
        >
          <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
          <span>New Account Registration</span>
        </motion.div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight">
          Join the FarmFlow Agricultural Network
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Select your stakeholder category below to configure your specialized workspace and digital credentials.
        </p>
      </div>

      {/* Role Selection Tabs - 4 Separate Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {rolesConfig.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRole === item.role;
          return (
            <motion.button
              key={item.role}
              id={`register-role-select-${item.role}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(item.role)}
              className={`relative p-4 rounded-3xl text-left border transition-all ${
                isSelected
                  ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
              }`}
            >
              {isSelected && (
                <motion.div 
                  layoutId="activeRegisterRoleIndicator"
                  className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-600"
                />
              )}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-stone-900 leading-snug">
                {item.title.split(' ')[0]}
              </div>
              <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                {item.subtitle.split('&')[0]}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main Registration Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Columns: Dynamic Registration Form */}
        <motion.div 
          key={selectedRole}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-6"
        >
          {/* Header of Form */}
          <div className="flex items-start justify-between border-b border-stone-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  {currentRole.badge}
                </span>
                <span className="text-xs text-stone-400 font-medium">Verified Profile Setup</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
                {currentRole.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                {currentRole.description}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700">
              <currentRole.icon className="w-6 h-6 text-emerald-700" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            
            {/* Common Section: Name, Mobile, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  {selectedRole === 'farmer' ? 'Farmer Full Name' : selectedRole === 'buyer_warehouse' ? 'Authorized Officer Name' : selectedRole === 'transport_owner' ? 'Fleet Operator Name' : 'Auditor Full Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'farmer' ? 'e.g. Murugan Karuppasamy' : 'e.g. Priya Sundaram'}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  Primary Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500 font-mono text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98421 87210"
                    className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder={selectedRole === 'farmer' ? 'farmer@kisan.in' : 'contact@agency.com'}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  Village / Taluk / Operational District
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={locationTaluk}
                    onChange={(e) => setLocationTaluk(e.target.value)}
                    placeholder="Dindigul West, Tamil Nadu"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- 1. Farmer Specific Configuration --- */}
            {selectedRole === 'farmer' && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase">
                  <Wheat className="w-4 h-4 text-emerald-700" />
                  <span>Agricultural Holding & Crop Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Cultivated Land (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={landAcres}
                      onChange={(e) => setLandAcres(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:border-emerald-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Irrigation Facility
                    </label>
                    <select
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-emerald-600 outline-hidden"
                    >
                      <option value="Drip Irrigation">Drip Irrigation</option>
                      <option value="Canal/Well">Canal / Open Well</option>
                      <option value="Rainfed">Rainfed / Dryland</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      PM-Kisan ID / Aadhaar Hash
                    </label>
                    <input
                      type="text"
                      value={pmKisanId}
                      onChange={(e) => setPmKisanId(e.target.value)}
                      placeholder="TN/DGL/2024/XXXX"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:border-emerald-600 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Crops Cultivated (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={primaryCrops}
                    onChange={(e) => setPrimaryCrops(e.target.value)}
                    placeholder="Tomato, Onion, Green Chilli, Cabbage"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-emerald-600 outline-hidden"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="fpoMemberCheck"
                    checked={isFpoMember}
                    onChange={(e) => setIsFpoMember(e.target.checked)}
                    className="rounded-md text-emerald-600 focus:ring-emerald-500 border-stone-300"
                  />
                  <label htmlFor="fpoMemberCheck" className="text-xs text-stone-700 font-medium cursor-pointer">
                    Member of Local FPO (Farmer Producer Organization) - Enables aggregated truck booking
                  </label>
                </div>
              </div>
            )}

            {/* --- 2. Buyer & Warehouse Specific Configuration --- */}
            {selectedRole === 'buyer_warehouse' && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase">
                  <Warehouse className="w-4 h-4 text-blue-700" />
                  <span>Commercial Warehouse & Procurement Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Entity / Corporate Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Agro Cold Hub"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Business Entity Type
                    </label>
                    <select
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-blue-600 outline-hidden"
                    >
                      <option value="Cold Storage Warehouse">Cold Storage Warehouse Operator</option>
                      <option value="Institutional Buyer">Institutional Buyer (Retail / Supermarkets)</option>
                      <option value="Wholesale Trader">Wholesale Mandi Commission Agent</option>
                      <option value="Food Processor">Food Processing & Export Unit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      GSTIN Number
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="33AABCA8920K1ZX"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:border-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      APMC License / WDRA Reg No.
                    </label>
                    <input
                      type="text"
                      value={apmcLicense}
                      onChange={(e) => setApmcLicense(e.target.value)}
                      placeholder="APMC/DGL/W-4482"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:border-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Cold Storage Total Capacity (Metric Tons)
                    </label>
                    <input
                      type="number"
                      value={warehouseCapacityMT}
                      onChange={(e) => setWarehouseCapacityMT(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:border-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Controlled Climate Temperature Range
                    </label>
                    <input
                      type="text"
                      value={tempRange}
                      onChange={(e) => setTempRange(e.target.value)}
                      placeholder="2°C to 12°C Controlled RH"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-blue-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- 3. Transport Fleet Specific Configuration --- */}
            {selectedRole === 'transport_owner' && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>Logistics Fleet & Vehicle Sizing Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Fleet Operator / Agency Name
                    </label>
                    <input
                      type="text"
                      value={transportAgencyName}
                      onChange={(e) => setTransportAgencyName(e.target.value)}
                      placeholder="Raja Agri Transport & Fleet"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-amber-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Total Active Commercial Vehicles
                    </label>
                    <input
                      type="number"
                      value={fleetCount}
                      onChange={(e) => setFleetCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:border-amber-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Permit Clearance Type
                    </label>
                    <select
                      value={permitType}
                      onChange={(e) => setPermitType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-amber-600 outline-hidden"
                    >
                      <option value="State Agricultural Permit">State Agricultural Permit (Tamil Nadu)</option>
                      <option value="All India Permit">All India Inter-State Permit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Service Taluks & Corridors
                    </label>
                    <input
                      type="text"
                      value={baseServiceTaluks}
                      onChange={(e) => setBaseServiceTaluks(e.target.value)}
                      placeholder="Dindigul, Oddanchatram, Palani, Madurai"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-amber-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- 4. Admin Access Clearance --- */}
            {selectedRole === 'admin' && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 uppercase">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Administrative Authorization Clearance</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Regulatory Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:border-indigo-600 outline-hidden"
                    >
                      <option value="Market Operations">Market Operations & Agmarknet Feeds</option>
                      <option value="Price Intelligence">AI Price Intelligence & Bayesian Learning</option>
                      <option value="Platform Security">Escrow Security & Dispute Arbitration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Official Directorate Officer ID
                    </label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="GOVT-TN-AGRI-XXXX"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:border-indigo-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Creation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                Create Secure Account Password / PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2 pt-1 text-xs text-stone-600">
              <input
                type="checkbox"
                id="termsBox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded-md text-emerald-600 focus:ring-emerald-500 border-stone-300"
                required
              />
              <label htmlFor="termsBox" className="cursor-pointer">
                I agree to the <strong>FarmFlow Fair Price & Escrow Code of Conduct</strong> and authorize verification with regional APMC records and e-NAM price indices.
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Verified Profile...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Complete {currentRole.title.split(' ')[0]} Registration</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Login Footer Link */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-2">
            <span>Already have an account registered?</span>
            <button
              onClick={() => onNavigateToLogin(selectedRole)}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Sign in to {currentRole.title.split(' ')[0]} Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Right 4 Columns: Onboarding Checklist & Guarantee */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl border border-stone-800 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Instant Verification</span>
            </div>

            <h3 className="text-lg font-bold font-heading text-stone-100">
              Why Register on FarmFlow AI?
            </h3>
            
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  1
                </div>
                <p>
                  <strong>Zero Hidden Intermediary Cuts:</strong> Calculate true in-hand revenue after all logistics and mandi commissions before leaving the farm.
                </p>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  2
                </div>
                <p>
                  <strong>Shared Vehicle Freight Savings:</strong> Automatically combine partial loads with neighboring farmers heading along the same corridor.
                </p>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  3
                </div>
                <p>
                  <strong>Price Uncertainty Band:</strong> Know the 80% and 95% statistical price range based on real-time arrival shock simulation.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Compliant with APMC Model Act & Digital Agriculture Mission 2026.</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-stone-500 uppercase">
              Need Instant Testing?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              To test all role-specific features without manual registration, you can use the <strong>1-Click Pre-Configured Logins</strong> available on the sign-in page.
            </p>
            <button
              onClick={() => onNavigateToLogin(selectedRole)}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Go to 1-Click Role Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
