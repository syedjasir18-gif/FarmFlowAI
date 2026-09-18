import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  PlusCircle, 
  ArrowRight,
  TrendingDown,
  PhoneCall,
  Sparkles,
  Layers,
  Scale,
  DollarSign,
  QrCode,
  FileCheck2,
  HelpCircle,
  Route
} from 'lucide-react';
import { Language } from '../types';

interface FarmerLoad {
  id: string;
  name: string;
  phone: string;
  crop: string;
  quantityKg: number;
  pickupLocation: string;
  status: 'Ready' | 'Harvesting' | 'Scheduled';
  soloCost: number;
}

interface VehicleOption {
  id: string;
  name: string;
  capacityKg: number;
  baseTripCost: number;
  perKmRate: number;
  driverName: string;
  driverPhone: string;
  rating: number;
}

interface SharedTransportOptimizerProps {
  language: Language;
}

export const SharedTransportOptimizer: React.FC<SharedTransportOptimizerProps> = ({ language }) => {
  // Available nearby farmers in the same corridor (Dindigul West ➔ Oddanchatram Central)
  const [nearbyFarmers, setNearbyFarmers] = useState<FarmerLoad[]>([
    {
      id: 'farmer-1',
      name: 'Farmer Murugan K.',
      phone: '+91 98421 87210',
      crop: 'Tomato (Grade A Firm)',
      quantityKg: 250,
      pickupLocation: 'Reddiarchatram Farm Gate (Km 12)',
      status: 'Ready',
      soloCost: 2400,
    },
    {
      id: 'farmer-2',
      name: 'Farmer Selvam P.',
      phone: '+91 94438 43210',
      crop: 'Tomato (Hybrid Desi)',
      quantityKg: 300,
      pickupLocation: 'Palani Road Bypass Point (Km 18)',
      status: 'Ready',
      soloCost: 2400,
    },
    {
      id: 'farmer-3',
      name: 'Farmer Arumugam V.',
      phone: '+91 97891 22910',
      crop: 'Tomato (Grade A)',
      quantityKg: 200,
      pickupLocation: 'Vedasandur Junction (Km 24)',
      status: 'Ready',
      soloCost: 2400,
    },
    {
      id: 'farmer-4',
      name: 'Farmer Chidambaram R.',
      phone: '+91 96290 88123',
      crop: 'Green Chilli (G4 Teja)',
      quantityKg: 180,
      pickupLocation: 'Natham Link Road (Km 15)',
      status: 'Harvesting',
      soloCost: 2400,
    },
  ]);

  // Selected farmers included in the current vehicle pool
  const [selectedFarmerIds, setSelectedFarmerIds] = useState<string[]>(['farmer-1', 'farmer-2', 'farmer-3']);

  // Vehicle fleet options
  const vehicles: VehicleOption[] = [
    {
      id: 'v-tata-ace',
      name: 'Tata Ace Gold (1.2 Ton)',
      capacityKg: 1200,
      baseTripCost: 3600,
      perKmRate: 14.5,
      driverName: 'Senthil Kumar (Verified Pilot)',
      driverPhone: '+91 98422 99881',
      rating: 4.9,
    },
    {
      id: 'v-bolero-maxi',
      name: 'Mahindra Bolero Maxi Truck (1.7 Ton)',
      capacityKg: 1700,
      baseTripCost: 4800,
      perKmRate: 16.0,
      driverName: 'Ramesh Velu (Logistics Lead)',
      driverPhone: '+91 94431 55662',
      rating: 4.8,
    },
    {
      id: 'v-ashok-dost',
      name: 'Ashok Leyland Dost+ (2.5 Ton)',
      capacityKg: 2500,
      baseTripCost: 6500,
      perKmRate: 18.5,
      driverName: 'K. Subramaniam',
      driverPhone: '+91 97890 11223',
      rating: 4.9,
    },
  ];

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('v-tata-ace');
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // User Farmer's own load input
  const [userLoadKg, setUserLoadKg] = useState<number>(250);
  const [includeUserInPool, setIncludeUserInPool] = useState<boolean>(true);

  // New Farmer Modal Form
  const [showAddFarmerModal, setShowAddFarmerModal] = useState<boolean>(false);
  const [newFarmerName, setNewFarmerName] = useState<string>('');
  const [newFarmerCrop, setNewFarmerCrop] = useState<string>('Tomato');
  const [newFarmerQty, setNewFarmerQty] = useState<number>(200);
  const [newFarmerLocation, setNewFarmerLocation] = useState<string>('Dindigul West');

  // Booked Status
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingPass, setBookingPass] = useState<any | null>(null);

  // Pool Calculations
  const pooledFarmers = nearbyFarmers.filter((f) => selectedFarmerIds.includes(f.id));
  const totalPooledWeightKg = pooledFarmers.reduce((sum, f) => sum + f.quantityKg, 0) + (includeUserInPool ? userLoadKg : 0);
  const totalParticipantsCount = pooledFarmers.length + (includeUserInPool ? 1 : 0);

  const capacityPercent = Math.min(100, Math.round((totalPooledWeightKg / selectedVehicle.capacityKg) * 100));
  const remainingCapacityKg = Math.max(0, selectedVehicle.capacityKg - totalPooledWeightKg);

  // Cost comparison calculations
  // Solo cost: If each farmer hired an individual vehicle, each would pay ₹2,400.
  const soloCostPerFarmer = 2400;
  const totalSoloCost = totalParticipantsCount * soloCostPerFarmer;

  // Pooled Cost: The single vehicle trip cost is split proportionally based on weight share
  const vehicleHireCost = selectedVehicle.baseTripCost;
  const sharedCostPerFarmer = totalParticipantsCount > 0 
    ? Math.round(vehicleHireCost / totalParticipantsCount) 
    : 0;

  const totalSavings = totalSoloCost - vehicleHireCost;
  const savingsPerFarmer = soloCostPerFarmer - sharedCostPerFarmer;

  const toggleFarmerSelection = (id: string) => {
    if (selectedFarmerIds.includes(id)) {
      setSelectedFarmerIds(selectedFarmerIds.filter((fId) => fId !== id));
    } else {
      setSelectedFarmerIds([...selectedFarmerIds, id]);
    }
  };

  const handleAddNewFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmerName) return;
    const newFarmer: FarmerLoad = {
      id: `farmer-${Date.now()}`,
      name: newFarmerName,
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      crop: newFarmerCrop,
      quantityKg: newFarmerQty,
      pickupLocation: newFarmerLocation,
      status: 'Ready',
      soloCost: 2400,
    };
    setNearbyFarmers([...nearbyFarmers, newFarmer]);
    setSelectedFarmerIds([...selectedFarmerIds, newFarmer.id]);
    setShowAddFarmerModal(false);
    setNewFarmerName('');
  };

  const handleConfirmPoolBooking = () => {
    const pass = {
      bookingId: `TRIP-POOL-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      route: 'Dindigul West Agricultural Corridor ➔ Oddanchatram Central Mandi',
      vehicleName: selectedVehicle.name,
      driverName: selectedVehicle.driverName,
      driverPhone: selectedVehicle.driverPhone,
      totalLoadKg: totalPooledWeightKg,
      capacityKg: selectedVehicle.capacityKg,
      participantsCount: totalParticipantsCount,
      soloCostPerFarmer,
      sharedCostPerFarmer,
      savingsPerFarmer,
      totalTripSavings: totalSavings,
      scheduledDeparture: 'Today, 03:30 PM (Evening Auction Express)',
      pickupWaypoints: [
        ...pooledFarmers.map((f) => `${f.name} (${f.quantityKg} kg) @ ${f.pickupLocation}`),
        ...(includeUserInPool ? [`You (${userLoadKg} kg) @ Your Farm Gate`] : []),
      ],
    };
    setBookingPass(pass);
    setBookingConfirmed(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wide shadow-xs">
                <Truck className="w-3.5 h-3.5 mr-1 fill-amber-950" /> Shared Transport Optimizer
              </span>
              <span className="text-xs text-emerald-200">
                Smallholder Freight Consolidation Engine
              </span>
            </div>
            
            <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-white">
              {language === 'ta' 
                ? 'பகிர்வு வாகன ஒருங்கிணைப்பான் (Shared Transport Optimizer)' 
                : 'Shared Freight Coordinator & Vehicle Pooling Engine'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {language === 'ta'
                ? 'ஒரே சந்தைக்கு செல்லும் விவசாயிகளின் சிறிய விளைச்சலை (200kg - 350kg) ஒரே வாகனத்தில் இணைத்து, தனித்தனி வாடகைச் செலவான ₹2,400 ஐ ₹1,400 ஆகக் குறைத்து, விவசாயிக்கு ₹1,000 வரை பணத்தை மிச்சப்படுத்துகிறது.'
                : 'Identifies multiple farmers along the same rural corridor heading to the same market, sizes the optimal shared commercial vehicle, and splits costs to save smallholders over 40% on every trip.'}
            </p>
          </div>

          {/* Demonstrated Savings Banner */}
          <div className="bg-amber-400 text-amber-950 p-4 rounded-2xl shadow-md shrink-0 text-center min-w-[240px]">
            <div className="text-xs font-extrabold uppercase tracking-wider">
              Demonstrated Cost Reduction
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-0.5">
              -₹{savingsPerFarmer > 0 ? savingsPerFarmer.toLocaleString() : '1,000'}
            </div>
            <div className="text-xs font-bold mt-1">
              Solo: ₹{soloCostPerFarmer.toLocaleString()} ➔ Pooled: ₹{sharedCostPerFarmer.toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-900 font-semibold mt-0.5">
              {totalParticipantsCount} Farmers Pooled in 1 Vehicle
            </div>
          </div>
        </div>
      </div>

      {/* Main Coordinator Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Corridor Farmers Selection Board (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-emerald-700" />
                  Corridor Matching Board: Dindigul ➔ Oddanchatram Central Mandi
                </h3>
                <p className="text-xs text-stone-500">
                  Select farmers to include in the shared vehicle consolidation load.
                </p>
              </div>

              <button
                id="btn-add-farmer-load"
                onClick={() => setShowAddFarmerModal(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Farmer</span>
              </button>
            </div>

            {/* Current User's Own Load Box */}
            <div className="bg-emerald-50/70 border-2 border-emerald-400/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
                  <span className="font-extrabold text-xs sm:text-sm text-emerald-950">
                    Your Harvest Load (FarmFlow Active User)
                  </span>
                </div>
                <label className="flex items-center space-x-2 text-xs font-bold text-emerald-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUserInPool}
                    onChange={(e) => setIncludeUserInPool(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Include My Load</span>
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-emerald-900 mb-1">
                    <span>Your Harvest Weight:</span>
                    <span className="font-mono font-bold">{userLoadKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={1000}
                    step={50}
                    value={userLoadKg}
                    onChange={(e) => setUserLoadKg(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-emerald-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-700 uppercase font-semibold">Solo Quote</span>
                  <div className="text-xs font-bold text-stone-500 line-through">₹2,400</div>
                  <div className="text-sm font-extrabold text-emerald-800 font-mono">
                    ₹{sharedCostPerFarmer} <span className="text-[10px]">Pooled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Farmers List */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
                <span>Nearby Smallholders Ready for Pickup:</span>
                <span className="text-stone-500 font-normal">
                  {selectedFarmerIds.length} of {nearbyFarmers.length} selected
                </span>
              </div>

              {nearbyFarmers.map((farmer) => {
                const isSelected = selectedFarmerIds.includes(farmer.id);
                return (
                  <motion.div
                    key={farmer.id}
                    layout
                    onClick={() => toggleFarmerSelection(farmer.id)}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition-all relative ${
                      isSelected
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50/70 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent div onClick
                          className="mt-1 accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs sm:text-sm text-stone-900">{farmer.name}</span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                              {farmer.crop}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5 flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{farmer.pickupLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-stone-900 font-mono">
                          {farmer.quantityKg} kg
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700">
                          Save ₹{soloCostPerFarmer - sharedCostPerFarmer}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right Column: Vehicle Sizing & Interactive Packing Meter (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-5">
            
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center">
                <Truck className="w-4 h-4 mr-2 text-emerald-700" />
                Select Shared Commercial Vehicle
              </h3>
              <p className="text-xs text-stone-500">
                Pick the optimal tonnage vehicle for this consolidated load.
              </p>
            </div>

            {/* Vehicle Selector Options */}
            <div className="space-y-2">
              {vehicles.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                const isCapacityExceeded = totalPooledWeightKg > v.capacityKg;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs sm:text-sm text-stone-900">{v.name}</div>
                      <span className="text-xs font-mono font-bold text-emerald-800">
                        ₹{v.baseTripCost} Trip Total
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mt-1">
                      <span>Max Payload: {v.capacityKg} kg</span>
                      <span>Pilot: {v.driverName} (★ {v.rating})</span>
                    </div>
                    {isCapacityExceeded && isSelected && (
                      <div className="text-[11px] font-semibold text-rose-700 mt-1">
                        ⚠️ Total load exceeds this vehicle capacity. Select larger vehicle!
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Interactive Packing & Load Capacity Progress Bar */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-stone-700">Vehicle Payload Utilization:</span>
                <span className={`font-mono ${capacityPercent > 100 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {totalPooledWeightKg} / {selectedVehicle.capacityKg} kg ({capacityPercent}%)
                </span>
              </div>

              {/* Multi-Segment Color Coded Capacity Meter */}
              <div className="w-full bg-stone-200 rounded-full h-3.5 overflow-hidden flex shadow-inner">
                {pooledFarmers.map((f, i) => {
                  const segWidth = (f.quantityKg / selectedVehicle.capacityKg) * 100;
                  const colors = ['bg-emerald-600', 'bg-teal-600', 'bg-blue-600', 'bg-indigo-600'];
                  return (
                    <div
                      key={f.id}
                      className={`h-full ${colors[i % colors.length]} transition-all duration-500`}
                      style={{ width: `${segWidth}%` }}
                      title={`${f.name}: ${f.quantityKg} kg`}
                    />
                  );
                })}
                {includeUserInPool && (
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${(userLoadKg / selectedVehicle.capacityKg) * 100}%` }}
                    title={`You: ${userLoadKg} kg`}
                  />
                )}
              </div>

              <div className="flex justify-between text-[11px] text-stone-500 pt-1">
                <span>{totalParticipantsCount} Farmers Pooled</span>
                <span className="font-semibold text-stone-700">
                  {remainingCapacityKg} kg space remaining
                </span>
              </div>
            </div>

            {/* Financial Ledger Breakdown Box */}
            <div className="border border-stone-200 rounded-2xl p-4 space-y-2 bg-white text-xs">
              <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider border-b border-stone-100 pb-1.5">
                Consolidation Economics (Per-Trip):
              </div>
              
              <div className="flex justify-between text-stone-600">
                <span>Separate Individual Hires ({totalParticipantsCount} x ₹{soloCostPerFarmer}):</span>
                <span className="font-mono font-semibold line-through">₹{totalSoloCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Consolidated Shared Vehicle Trip Hire:</span>
                <span className="font-mono">₹{vehicleHireCost.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                <span className="font-extrabold text-stone-900 text-sm">Total Corridor Savings:</span>
                <span className="text-base font-extrabold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Save ₹{totalSavings.toLocaleString()} ({Math.round((totalSavings / totalSoloCost) * 100)}%)
                </span>
              </div>
            </div>

            {/* Confirm Pool Booking Action Button */}
            <button
              id="btn-lock-shared-vehicle-slot"
              onClick={handleConfirmPoolBooking}
              disabled={capacityPercent > 100 || totalParticipantsCount === 0}
              className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lock Shared Vehicle & Dispatch Slip</span>
            </button>

          </div>

        </div>

      </div>

      {/* Add Farmer Modal */}
      {showAddFarmerModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="font-bold text-base text-stone-900">Add Smallholder to Pool</h4>
              <button
                onClick={() => setShowAddFarmerModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewFarmer} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Farmer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farmer Ramanathan"
                  value={newFarmerName}
                  onChange={(e) => setNewFarmerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Crop</label>
                  <input
                    type="text"
                    value={newFarmerCrop}
                    onChange={(e) => setNewFarmerCrop(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Harvest Weight (kg)</label>
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    value={newFarmerQty}
                    onChange={(e) => setNewFarmerQty(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Pickup Village / Taluk</label>
                <input
                  type="text"
                  value={newFarmerLocation}
                  onChange={(e) => setNewFarmerLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFarmerModal(false)}
                  className="px-3 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 font-bold"
                >
                  Add to Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmed Dispatch Slip Modal */}
      {bookingConfirmed && bookingPass && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-emerald-500/50 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                    Official Transport Pass
                  </span>
                  <h4 className="font-extrabold text-base text-stone-900">
                    {bookingPass.bookingId}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Assigned Vehicle:</span>
                <span className="font-bold text-stone-900">{bookingPass.vehicleName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Commercial Pilot:</span>
                <span className="font-bold text-stone-900">{bookingPass.driverName} ({bookingPass.driverPhone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Scheduled Departure:</span>
                <span className="font-bold text-emerald-800">{bookingPass.scheduledDeparture}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Your Shared Freight Cost:</span>
                <span className="font-extrabold text-emerald-700 font-mono text-sm">
                  ₹{bookingPass.sharedCostPerFarmer} (Saved ₹{bookingPass.savingsPerFarmer})
                </span>
              </div>
            </div>

            {/* Waypoints Sequence */}
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-stone-700 flex items-center">
                <Route className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Pickup Sequence ({bookingPass.participantsCount} Smallholders):
              </div>
              <div className="space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100 max-h-32 overflow-y-auto">
                {bookingPass.pickupWaypoints.map((wp: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-stone-700 text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[9px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{wp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200"
              >
                Print Trip Slip
              </button>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};
