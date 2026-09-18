import React from 'react';
import { 
  Sprout, 
  Wifi, 
  WifiOff, 
  Award, 
  Mic, 
  Globe2, 
  TrendingUp,
  Layers,
  Sparkles,
  User,
  Wheat,
  Warehouse,
  Truck,
  ShieldCheck,
  ChevronDown,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Calculator,
  Coins,
  DollarSign
} from 'lucide-react';
import { Language, UserProfile, UserRole } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  onOpenCommercialModel: () => void;
  onOpenVoice: () => void;
  onOpenCompetitors: () => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  activeMainView: 'intelligence' | 'workspace' | 'login' | 'register';
  onNavigateToIntelligence: () => void;
  onNavigateToWorkspace: () => void;
  onNavigateToLogin: (role?: UserRole) => void;
  onNavigateToRegister: (role?: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  isOfflineMode,
  setIsOfflineMode,
  onOpenCommercialModel,
  onOpenVoice,
  onOpenCompetitors,
  currentUser,
  onOpenAuth,
  activeMainView,
  onNavigateToIntelligence,
  onNavigateToWorkspace,
  onNavigateToLogin,
  onNavigateToRegister,
}) => {
  const getRoleIcon = () => {
    switch (currentUser.role) {
      case 'farmer':
        return <Wheat className="w-3.5 h-3.5 text-emerald-700" />;
      case 'buyer_warehouse':
        return <Warehouse className="w-3.5 h-3.5 text-blue-700" />;
      case 'transport_owner':
        return <Truck className="w-3.5 h-3.5 text-amber-700" />;
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />;
    }
  };

  const getRoleBadgeLabel = () => {
    switch (currentUser.role) {
      case 'farmer':
        return 'Farmer';
      case 'buyer_warehouse':
        return 'Buyer / Storage';
      case 'transport_owner':
        return 'Fleet Owner';
      case 'admin':
        return 'Admin';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo and Brand */}
          <div 
            onClick={onNavigateToIntelligence}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-400/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-emerald-950">
                  FarmFlow<span className="text-emerald-600">.AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Production AgTech
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                {language === 'ta' 
                  ? 'விவசாயிகளுக்கான அறிவார்ந்த சந்தை & வாகன பகிர்வு தளம்'
                  : language === 'hi'
                  ? 'किसानों के लिए नेट-रियलाइजेशन व शेयर्ड लॉजिस्टिक्स इंजन'
                  : 'True Net Realization & Shared Transport Dispatch System'}
              </p>
            </div>
          </div>

          {/* Center Navigation Links: Intelligence Suite vs Role Workspace vs Login/Register */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-100/80 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
            <button
              onClick={onNavigateToIntelligence}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeMainView === 'intelligence'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Intelligence Suite</span>
            </button>

            <button
              onClick={onNavigateToWorkspace}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeMainView === 'workspace'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              <span>{getRoleBadgeLabel()} Console</span>
            </button>

            <button
              onClick={() => onNavigateToLogin()}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeMainView === 'login'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-stone-500" />
              <span>Login</span>
            </button>

            <button
              onClick={() => onNavigateToRegister()}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeMainView === 'register'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Register</span>
            </button>
          </nav>

          {/* Quick Actions & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* User Profile & Role Switcher Button */}
            <button
              id="header-user-role-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all text-xs text-left"
              title="Click to Switch Role or Log In (Farmer, Buyer/Warehouse, Transport, Admin)"
            >
              <div className="p-1 rounded-lg bg-white shadow-2xs border border-stone-200">
                {getRoleIcon()}
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-stone-900 leading-none truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-stone-500 font-medium leading-tight">
                  {getRoleBadgeLabel()}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Tamil / Voice Assistant Quick Launcher */}
            <button
              id="header-voice-assistant-btn"
              onClick={onOpenVoice}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-xs active:scale-95"
              title="Voice Assistant in Tamil / Hindi / English"
            >
              <Mic className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span className="hidden sm:inline">
                {language === 'ta' ? 'குரல் உதவி' : language === 'hi' ? 'आवाज़ सहायक' : 'Tamil Voice'}
              </span>
              <span className="sm:hidden">Voice</span>
            </button>

            {/* Offline / Low Data Toggle */}
            <button
              id="header-offline-mode-toggle"
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                isOfflineMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title="Toggle Low-Data / Rural Offline Mode"
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-semibold text-amber-800">2G / Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline text-stone-700">Live</span>
                </>
              )}
            </button>

            {/* Commercial Model, Take-Rate & ROI Modal */}
            <button
              id="header-pricing-roi-btn"
              onClick={onOpenCommercialModel}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 transition-all shadow-2xs"
              title="View Monetization Engine & SaaS Tiers"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Pricing & ROI</span>
              <span className="sm:hidden">ROI</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
              <button
                id="lang-btn-en"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'en' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                id="lang-btn-ta"
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'ta' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
              <button
                id="lang-btn-hi"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'hi' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
