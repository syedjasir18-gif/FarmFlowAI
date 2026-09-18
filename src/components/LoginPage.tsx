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
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Building2, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserCheck, 
  HelpCircle,
  ChevronRight,
  Shield,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { UserRole, UserProfile, Language } from '../types';
import { DEMO_USERS, saveStoredUser } from '../data/authData';

interface LoginPageProps {
  language: Language;
  initialRole?: UserRole;
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateToRegister: (initialRole?: UserRole) => void;
  onBackToApp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  initialRole = 'farmer',
  onLoginSuccess,
  onNavigateToRegister,
  onBackToApp,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('4821');

  // Form State for each role
  const [farmerPhone, setFarmerPhone] = useState<string>('9842187210');
  const [farmerPin, setFarmerPin] = useState<string>('8721');

  const [buyerEmail, setBuyerEmail] = useState<string>('priya.sundaram@apexagro.in');
  const [buyerApmc, setBuyerApmc] = useState<string>('APMC/DGL/W-4482');
  const [buyerPassword, setBuyerPassword] = useState<string>('ApexAgro@2026');

  const [transportPhone, setTransportPhone] = useState<string>('9789034512');
  const [transportCompany, setTransportCompany] = useState<string>('Raja Agri Logistics');
  const [transportPin, setTransportPin] = useState<string>('3451');

  const [adminEmail, setAdminEmail] = useState<string>('admin.venkatesh@farmflow.ai');
  const [adminKey, setAdminKey] = useState<string>('ADMIN-AGRI-NOC-2026');

  const rolesConfig: {
    role: UserRole;
    title: string;
    titleTamil: string;
    subtitle: string;
    icon: typeof Wheat;
    badge: string;
    accentColor: string;
    bgGlow: string;
    demoUser: UserProfile;
  }[] = [
    {
      role: 'farmer',
      title: 'Farmer / Kisan Login',
      titleTamil: 'விவசாயிகள் உள்நுழைவு',
      subtitle: 'Smallholders, FPO Members & Crop Sellers',
      icon: Wheat,
      badge: 'Direct Farm-to-Market',
      accentColor: 'emerald',
      bgGlow: 'from-emerald-500/10 to-teal-500/5',
      demoUser: DEMO_USERS.farmer,
    },
    {
      role: 'buyer_warehouse',
      title: 'Buyer & Cold Storage Login',
      titleTamil: 'வாங்குவோர் & கிடங்கு உள்நுழைவு',
      subtitle: 'Wholesalers, Cold Storages, Processors & Exporters',
      icon: Warehouse,
      badge: 'APMC & GST Licensed',
      accentColor: 'blue',
      bgGlow: 'from-blue-500/10 to-indigo-500/5',
      demoUser: DEMO_USERS.buyer_warehouse,
    },
    {
      role: 'transport_owner',
      title: 'Transport Fleet Owner Login',
      titleTamil: 'வாகன உரிமையாளர் உள்நுழைவு',
      subtitle: 'Agri Vehicle Operators, Truck Drivers & Logistics Fleets',
      icon: Truck,
      badge: 'Agricultural Route Permits',
      accentColor: 'amber',
      bgGlow: 'from-amber-500/10 to-orange-500/5',
      demoUser: DEMO_USERS.transport_owner,
    },
    {
      role: 'admin',
      title: 'Platform Admin & Auditor Login',
      titleTamil: 'நிர்வாகி உள்நுழைவு',
      subtitle: 'Agmarknet Regulators, NOC Directors & Price Auditors',
      icon: ShieldCheck,
      badge: 'System Governance Level',
      accentColor: 'indigo',
      bgGlow: 'from-indigo-500/10 to-purple-500/5',
      demoUser: DEMO_USERS.admin,
    },
  ];

  const currentRoleConfig = rolesConfig.find((r) => r.role === selectedRole) || rolesConfig[0];

  const handleInstantDemoLogin = (role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const demo = DEMO_USERS[role];
      saveStoredUser(demo);
      onLoginSuccess(demo);
      setIsSubmitting(false);
    }, 450);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Create authenticated user or map from demo
      const base = DEMO_USERS[selectedRole];
      const loggedUser: UserProfile = {
        ...base,
        id: `usr-${selectedRole}-${Date.now().toString().slice(-4)}`,
        verified: true,
      };

      saveStoredUser(loggedUser);
      onLoginSuccess(loggedUser);
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
          <span>256-bit Encrypted Agri-Escrow Portal</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Multi-Stakeholder Agricultural Gateway</span>
        </motion.div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight">
          Welcome to FarmFlow Authentication
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Log in with your designated role to access real-time price discovery, shared logistics dispatch, and escrow settlements.
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
              id={`login-role-select-${item.role}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedRole(item.role);
                setOtpSent(false);
              }}
              className={`relative p-4 rounded-3xl text-left border transition-all ${
                isSelected
                  ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
              }`}
            >
              {isSelected && (
                <motion.div 
                  layoutId="activeRoleIndicator"
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
                {item.title.split('/')[0].trim()}
              </div>
              <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                {item.subtitle.split(',')[0]}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main Login Card Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: The Interactive Form */}
        <motion.div 
          key={selectedRole}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-6"
        >
          {/* Header of Form */}
          <div className="flex items-start justify-between border-b border-stone-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  {currentRoleConfig.badge}
                </span>
                <span className="text-xs text-stone-400 font-medium">Step 1 of 1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
                {currentRoleConfig.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                {language === 'ta' ? currentRoleConfig.titleTamil : currentRoleConfig.subtitle}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700">
              <currentRoleConfig.icon className="w-6 h-6 text-emerald-700" />
            </div>
          </div>

          {/* Form Fields Depending on Role */}
          <form onSubmit={handleStandardSubmit} className="space-y-4">
            
            {/* 1. Farmer Login Fields */}
            {selectedRole === 'farmer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Kisan Registered Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500 font-mono text-sm">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      placeholder="98421 87210"
                      className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Linked to PM-Kisan & State Agri Subsidy Portal
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase">
                      4-Digit Kisan PIN / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(!otpSent)}
                      className="text-xs text-emerald-700 font-semibold hover:underline"
                    >
                      {otpSent ? 'Enter PIN instead' : 'Login via SMS OTP'}
                    </button>
                  </div>

                  {!otpSent ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={farmerPin}
                        onChange={(e) => setFarmerPin(e.target.value)}
                        placeholder="••••"
                        maxLength={6}
                        className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-mono tracking-widest text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
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
                  ) : (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs text-emerald-800">
                        <span className="font-semibold">SMS OTP sent to +91 {farmerPhone}</span>
                        <span className="font-mono text-emerald-700 font-bold">Expires in 02:45</span>
                      </div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-emerald-950 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Buyer & Cold Storage Login Fields */}
            {selectedRole === 'buyer_warehouse' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Official Corporate Email / Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="procurement@buyer.in"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    APMC License ID / Warehouse Reg No.
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={buyerApmc}
                      onChange={(e) => setBuyerApmc(e.target.value)}
                      placeholder="APMC/DGL/W-4482"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-mono text-stone-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Password / Escrow Token
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={buyerPassword}
                      onChange={(e) => setBuyerPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all"
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
              </div>
            )}

            {/* 3. Transport Fleet Owner Login Fields */}
            {selectedRole === 'transport_owner' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Transporter Registered Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500 font-mono text-sm">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={transportPhone}
                      onChange={(e) => setTransportPhone(e.target.value)}
                      placeholder="97890 34512"
                      className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 font-mono focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Commercial Fleet Agency / Operator Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Truck className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={transportCompany}
                      onChange={(e) => setTransportCompany(e.target.value)}
                      placeholder="Raja Agri Logistics Fleet"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Fleet Dispatch PIN / Security Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={transportPin}
                      onChange={(e) => setTransportPin(e.target.value)}
                      placeholder="••••"
                      maxLength={6}
                      className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-mono tracking-widest text-stone-900 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all"
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
              </div>
            )}

            {/* 4. Platform Admin Login Fields */}
            {selectedRole === 'admin' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Official Admin Government / NOC Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin.officer@farmflow.ai"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                    Market Regulator Clearance Key & MFA Token
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="ADMIN-KEY-XXXX-2026"
                      className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-mono text-stone-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all"
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
              </div>
            )}

            {/* Remember & Forgot options */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded-md text-emerald-600 focus:ring-emerald-500 border-stone-300"
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                className="text-stone-500 hover:text-emerald-700 font-medium"
              >
                Forgot credentials?
              </button>
            </div>

            {/* Primary Action Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Secure Login as {currentRoleConfig.title.split('/')[0].trim()}</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Registration Footer Link */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-2">
            <span>Don't have a verified account yet?</span>
            <button
              onClick={() => onNavigateToRegister(selectedRole)}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Register as {currentRoleConfig.title.split('/')[0].trim()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Right 5 Columns: 1-Click Instant Demo Access & Role Perks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick 1-Click Demo Evaluation Box */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl p-6 shadow-xl border border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Verified Role 1-Click Sandbox</span>
              </span>
              <span className="text-[11px] text-stone-400 font-mono">No Typing Needed</span>
            </div>

            <h3 className="text-lg font-bold font-heading text-stone-100 mb-2">
              Instant Demo Access for {currentRoleConfig.title.split('/')[0].trim()}
            </h3>
            <p className="text-xs text-stone-300 mb-4 leading-relaxed">
              Test all role-specific features immediately with pre-configured verified credentials:
            </p>

            <div className="bg-stone-800/80 rounded-2xl p-3 border border-stone-700/80 space-y-1.5 mb-5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Pre-loaded Profile:</span>
                <span className="font-bold text-emerald-300">{currentRoleConfig.demoUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Location:</span>
                <span className="text-stone-300 font-mono text-[11px]">{currentRoleConfig.demoUser.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified & Active
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInstantDemoLogin(selectedRole)}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-sm text-stone-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 fill-stone-950" />
              <span>Launch Demo Session Now</span>
            </motion.button>
          </div>

          {/* Role Feature Highlights */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-stone-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>What you get in this role</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-stone-600">
              {selectedRole === 'farmer' && (
                <>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pre-Dispatch Mandi Comparison:</strong> Compare net returns after all transport and mandi fees.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Shared Transport Pool:</strong> Cut solo transport costs by 40%+ by combining with nearby farmers.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Price Forecasting:</strong> 7-14 day outlook with statistical confidence bands.</span>
                  </li>
                </>
              )}

              {selectedRole === 'buyer_warehouse' && (
                <>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Real-Time Lot Intake:</strong> Monitor scheduled farmer arrivals with verified quality specs.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Cold Storage Capacity Ledger:</strong> Live temperature zone management (2°C to 14°C).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Direct FPO Procurement:</strong> Disintermediate brokers and lock forward purchase contracts.</span>
                  </li>
                </>
              )}

              {selectedRole === 'transport_owner' && (
                <>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Corridor Load Optimization:</strong> Auto-combine partial farmer loads to reach 95%+ vehicle fill rate.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Multi-Waypoint Dispatch:</strong> Optimized route navigation from rural farm gates to wholesale mandis.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Automated Freight Billing:</strong> Guaranteed digital freight payout per quintal/km.</span>
                  </li>
                </>
              )}

              {selectedRole === 'admin' && (
                <>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>System-Wide Agmarknet Sync:</strong> Live monitoring of 42 APMC mandis and e-NAM price pipes.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Bayesian Model Learning Loop:</strong> Track prediction vs actual sale accuracy across Tamil Nadu.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Grievance & Escrow Resolution:</strong> Settle quality dockage disputes and transit insurance claims.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
