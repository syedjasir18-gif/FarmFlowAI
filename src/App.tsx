import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Truck, 
  RotateCcw, 
  Navigation, 
  ShieldAlert, 
  ShieldCheck, 
  Mic, 
  Award, 
  Layers, 
  WifiOff, 
  Check, 
  Copy,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Scale,
  DollarSign,
  Calculator,
  Building2,
  Warehouse,
  UserCheck,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Wheat,
  ArrowRight
} from 'lucide-react';
import { Language, UserProfile, UserRole } from './types';
import { getStoredUser, saveStoredUser } from './data/authData';
import { Header } from './components/Header';
import { PriceDemandForecasting } from './components/PriceDemandForecasting';
import { SharedTransportOptimizer } from './components/SharedTransportOptimizer';
import { NetRealizationEngine } from './components/NetRealizationEngine';
import { DecisionEngine } from './components/DecisionEngine';
import { SharedTransportPoolView } from './components/SharedTransportPool';
import { OutcomeLearningLoop } from './components/OutcomeLearningLoop';
import { MarketRouteOptimizer } from './components/MarketRouteOptimizer';
import { ShelfLifeIntelligence } from './components/ShelfLifeIntelligence';
import { BuyerMatching } from './components/BuyerMatching';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { RoleWorkspaceView } from './components/RoleWorkspaceView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CompetitorMatrixModal } from './components/CompetitorMatrixModal';
import { CommercialModelModal } from './components/CommercialModelModal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  
  // Main View state: Intelligence Suite vs Role Console vs Login Page vs Register Page
  const [mainView, setMainView] = useState<'intelligence' | 'workspace' | 'login' | 'register'>('intelligence');
  const [targetAuthRole, setTargetAuthRole] = useState<UserRole>('farmer');

  // Intelligence Tabs
  const [activeTab, setActiveTab] = useState<
    'forecasting' | 'shared_transport' | 'net_realization' | 'decision' | 'transport_pool' | 'learning' | 'routes' | 'shelflife' | 'buyers'
  >('forecasting');
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Modals state
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isCommercialModelOpen, setIsCommercialModelOpen] = useState<boolean>(false);
  const [isCompetitorsOpen, setIsCompetitorsOpen] = useState<boolean>(false);

  // Quick SMS Copied state for offline mode
  const [smsCopied, setSmsCopied] = useState<boolean>(false);

  const handleCopySMS = () => {
    navigator.clipboard?.writeText('FF TOMATO 500 DGL A');
    setSmsCopied(true);
    setTimeout(() => setSmsCopied(false), 2500);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveStoredUser(user);
    setIsAuthOpen(false);
    // After logging in, guide them to their specialized workspace
    setMainView('workspace');
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveStoredUser(user);
    setMainView('workspace');
  };

  const handleOpenLogin = (role?: UserRole) => {
    if (role) setTargetAuthRole(role);
    setMainView('login');
  };

  const handleOpenRegister = (role?: UserRole) => {
    if (role) setTargetAuthRole(role);
    setMainView('register');
  };

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 flex flex-col selection:bg-emerald-200 font-sans">
      
      {/* Top Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        isOfflineMode={isOfflineMode}
        setIsOfflineMode={setIsOfflineMode}
        onOpenCommercialModel={() => setIsCommercialModelOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenCompetitors={() => setIsCompetitorsOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeMainView={mainView}
        onNavigateToIntelligence={() => setMainView('intelligence')}
        onNavigateToWorkspace={() => setMainView('workspace')}
        onNavigateToLogin={handleOpenLogin}
        onNavigateToRegister={handleOpenRegister}
      />

      {/* Offline / Low Data Simulation Banner */}
      {isOfflineMode && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold border-b border-amber-600 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-950 shrink-0" />
            <span>
              <strong>Rural Low-Data / Offline Mode Active:</strong> Serving cached regional mandi prices and heuristic net realization engine without live bandwidth.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-amber-900">Feature Phone SMS Query:</span>
            <code className="bg-amber-600/30 px-2 py-0.5 rounded font-mono text-[11px]">FF TOMATO 500 DGL A ➔ 56161</code>
            <button
              onClick={handleCopySMS}
              className="bg-amber-900 hover:bg-amber-950 text-white px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center space-x-1"
            >
              {smsCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{smsCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <AnimatePresence mode="wait">
          
          {/* ========================================================= */}
          {/* 1. DEDICATED FULL-PAGE LOGIN VIEW                         */}
          {/* ========================================================= */}
          {mainView === 'login' && (
            <motion.div
              key="view-login-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <LoginPage
                language={language}
                initialRole={targetAuthRole}
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={handleOpenRegister}
                onBackToApp={() => setMainView('intelligence')}
              />
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 2. DEDICATED FULL-PAGE REGISTRATION VIEW                  */}
          {/* ========================================================= */}
          {mainView === 'register' && (
            <motion.div
              key="view-register-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterPage
                language={language}
                initialRole={targetAuthRole}
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={handleOpenLogin}
                onBackToApp={() => setMainView('intelligence')}
              />
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. DEDICATED ROLE WORKSPACE VIEW                          */}
          {/* ========================================================= */}
          {mainView === 'workspace' && (
            <motion.div
              key="view-workspace-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setMainView('intelligence')}
                  className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-700"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Switch to Market Intelligence Suite</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Switch User Role
                  </button>
                </div>
              </div>

              <RoleWorkspaceView 
                user={currentUser} 
                language={language}
                onNavigateToTab={(tabKey) => {
                  setActiveTab(tabKey as any);
                  setMainView('intelligence');
                }}
              />
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 4. PRIMARY INTELLIGENCE SUITE VIEW                        */}
          {/* ========================================================= */}
          {mainView === 'intelligence' && (
            <motion.div
              key="view-intelligence-suite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Role Quick Bar for Non-Farmer Roles */}
              {currentUser.role !== 'farmer' && (
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                      {currentUser.role === 'buyer_warehouse' ? <Warehouse className="w-4 h-4" /> :
                       currentUser.role === 'transport_owner' ? <Truck className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        {currentUser.name} ({currentUser.role === 'buyer_warehouse' ? 'Buyer Hub' : currentUser.role === 'transport_owner' ? 'Fleet Operator' : 'Admin'})
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Viewing Public AI Price & Mandi Dispatch Intelligence
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMainView('workspace')}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center space-x-1"
                  >
                    <span>Open My Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Navigation Tabs Bar */}
              <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-xs flex overflow-x-auto no-scrollbar space-x-1">
                
                {/* 1. Price & Demand Forecasting */}
                <button
                  id="tab-price-demand-forecasting"
                  onClick={() => setActiveTab('forecasting')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'forecasting'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'விலை முன்னறிவிப்பு' : 'Price & Demand Forecasting'}
                  </span>
                  <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-amber-950 font-extrabold">
                    AI Uncertainty
                  </span>
                </button>

                {/* 2. Shared Transport Optimizer */}
                <button
                  id="tab-shared-transport-optimizer"
                  onClick={() => setActiveTab('shared_transport')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'shared_transport'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'பகிர்வு வாகன ஒருங்கிணைப்பான்' : 'Shared Transport Optimizer'}
                  </span>
                  <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                    Save 40%+
                  </span>
                </button>

                {/* 3. Net Realization Engine */}
                <button
                  id="tab-net-realization-engine"
                  onClick={() => setActiveTab('net_realization')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'net_realization'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'நிகர வருவாய் கணக்கீடு' : 'Net Realization Engine'}
                  </span>
                </button>

                {/* 4. Pre-Dispatch Mandi Comparison */}
                <button
                  id="tab-pre-dispatch-decision"
                  onClick={() => setActiveTab('decision')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'decision'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'மண்டி ஒப்பீடு' : 'Mandi Comparison'}
                  </span>
                </button>

                {/* 5. Outcome Learning Loop */}
                <button
                  id="tab-learning-loop"
                  onClick={() => setActiveTab('learning')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'learning'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'கற்றல் சுழற்சி' : 'Outcome-Learning Loop'}
                  </span>
                </button>

                {/* 6. Mandi Routes & Gluts */}
                <button
                  id="tab-market-routes"
                  onClick={() => setActiveTab('routes')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'routes'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'சந்தை வழித்தடம்' : 'Mandi Routes & Gluts'}
                  </span>
                </button>

                {/* 7. Shelf-Life Spoilage */}
                <button
                  id="tab-shelf-life"
                  onClick={() => setActiveTab('shelflife')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'shelflife'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'அழுகல் அபாயம்' : 'Shelf-Life Spoilage'}
                  </span>
                </button>

                {/* 8. Verified Buyers */}
                <button
                  id="tab-verified-buyers"
                  onClick={() => setActiveTab('buyers')}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === 'buyers'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {language === 'ta' ? 'வாங்குவோர்' : 'Verified Buyers'}
                  </span>
                </button>

              </div>

              {/* Dynamic Tab Body with Smooth Motion Transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'forecasting' && (
                    <PriceDemandForecasting language={language} />
                  )}

                  {activeTab === 'shared_transport' && (
                    <SharedTransportOptimizer language={language} />
                  )}

                  {activeTab === 'net_realization' && (
                    <NetRealizationEngine language={language} />
                  )}

                  {activeTab === 'decision' && (
                    <DecisionEngine
                      language={language}
                      onSelectMandiForDispatch={(name, net) => {
                        setActiveTab('net_realization');
                      }}
                      onJoinSharedTransport={() => {
                        setActiveTab('shared_transport');
                      }}
                    />
                  )}

                  {activeTab === 'transport_pool' && (
                    <SharedTransportPoolView
                      language={language}
                      currentFarmerLoadKg={500}
                      currentCropName="Tomato (Fresh Harvest)"
                    />
                  )}

                  {activeTab === 'learning' && (
                    <OutcomeLearningLoop language={language} />
                  )}

                  {activeTab === 'routes' && (
                    <MarketRouteOptimizer language={language} />
                  )}

                  {activeTab === 'shelflife' && (
                    <ShelfLifeIntelligence language={language} />
                  )}

                  {activeTab === 'buyers' && (
                    <BuyerMatching
                      language={language}
                      currentCropId="tomato"
                      currentQuantityKg={500}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Rich Footer with Stakeholder Portals & Commercial Links */}
      <footer className="bg-white border-t border-stone-200 py-8 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="font-bold text-stone-900 text-sm mb-2 flex items-center space-x-1.5">
                <Wheat className="w-4 h-4 text-emerald-700" />
                <span>Farmers & FPOs</span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <button onClick={() => handleOpenLogin('farmer')} className="hover:text-emerald-700">
                    Farmer Portal Login
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenRegister('farmer')} className="hover:text-emerald-700">
                    Register New Kisan Account
                  </button>
                </li>
                <li>
                  <button onClick={() => { setMainView('intelligence'); setActiveTab('net_realization'); }} className="hover:text-emerald-700">
                    Net Realization Engine
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-stone-900 text-sm mb-2 flex items-center space-x-1.5">
                <Warehouse className="w-4 h-4 text-blue-700" />
                <span>Buyers & Warehouses</span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <button onClick={() => handleOpenLogin('buyer_warehouse')} className="hover:text-blue-700">
                    Warehouse & Buyer Login
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenRegister('buyer_warehouse')} className="hover:text-blue-700">
                    Register Cold Storage Facility
                  </button>
                </li>
                <li>
                  <button onClick={() => { setMainView('intelligence'); setActiveTab('buyers'); }} className="hover:text-blue-700">
                    Direct Institutional Contracts
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-stone-900 text-sm mb-2 flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>Transport Fleet</span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <button onClick={() => handleOpenLogin('transport_owner')} className="hover:text-amber-700">
                    Fleet Owner Login
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenRegister('transport_owner')} className="hover:text-amber-700">
                    Register Transport Fleet
                  </button>
                </li>
                <li>
                  <button onClick={() => { setMainView('intelligence'); setActiveTab('shared_transport'); }} className="hover:text-amber-700">
                    Shared Corridor Optimizer
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-stone-900 text-sm mb-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>Governance & Admin</span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <button onClick={() => handleOpenLogin('admin')} className="hover:text-indigo-700">
                    Market Regulator Login
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenRegister('admin')} className="hover:text-indigo-700">
                    Register Official Auditor
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsCommercialModelOpen(true)} className="hover:text-emerald-700 font-bold text-emerald-800">
                    Pricing & Commercial Model
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              <span className="font-bold text-stone-800">FarmFlow AI</span> — Commercial Agri-Market Intelligence & Collaborative Logistics Platform.
              <span className="ml-1 text-stone-400">Integrated with e-NAM, Agmarknet & APMC standard protocols.</span>
            </div>
            <div className="flex items-center space-x-4 font-semibold text-stone-600">
              <button onClick={() => setIsCommercialModelOpen(true)} className="hover:text-emerald-700 text-emerald-800">
                Pricing & ROI
              </button>
              <button onClick={() => setIsCompetitorsOpen(true)} className="hover:text-emerald-700">
                Competitor Matrix
              </button>
              <button onClick={() => setIsVoiceOpen(true)} className="hover:text-emerald-700">
                Tamil Voice
              </button>
              <button onClick={() => setIsAuthOpen(true)} className="hover:text-emerald-700 text-emerald-800 font-bold">
                Switch Role ({currentUser.name.split(' ')[0]})
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
      />

      <CompetitorMatrixModal
        isOpen={isCompetitorsOpen}
        onClose={() => setIsCompetitorsOpen(false)}
      />

      <CommercialModelModal
        isOpen={isCommercialModelOpen}
        onClose={() => setIsCommercialModelOpen(false)}
      />

    </div>
  );
}
