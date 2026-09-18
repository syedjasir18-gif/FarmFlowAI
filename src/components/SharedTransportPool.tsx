import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { SharedTransportPool, Language } from '../types';
import { SHARED_TRANSPORT_POOLS } from '../data/agriData';

interface SharedTransportPoolProps {
  language: Language;
  currentFarmerLoadKg?: number;
  currentCropName?: string;
}

export const SharedTransportPoolView: React.FC<SharedTransportPoolProps> = ({
  language,
  currentFarmerLoadKg = 500,
  currentCropName = 'Tomato',
}) => {
  const [pools, setPools] = useState<SharedTransportPool[]>(SHARED_TRANSPORT_POOLS);
  const [joinedPoolId, setJoinedPoolId] = useState<string | null>(null);
  const [showNewPoolModal, setShowNewPoolModal] = useState<boolean>(false);
  const [newOrigin, setNewOrigin] = useState<string>('Reddiarchatram');
  const [newDestination, setNewDestination] = useState<string>('Oddanchatram Central Market');

  const handleJoinPool = (poolId: string) => {
    setPools((prevPools) =>
      prevPools.map((pool) => {
        if (pool.id === poolId) {
          const newBooked = Math.min(pool.totalCapacityKg, pool.bookedCapacityKg + currentFarmerLoadKg);
          return {
            ...pool,
            bookedCapacityKg: newBooked,
            participants: [
              ...pool.participants,
              {
                farmerName: 'You (FarmFlow User)',
                crop: currentCropName,
                quantityKg: currentFarmerLoadKg,
                pickupPoint: 'Your Farm Gate / Taluk Point',
              },
            ],
          };
        }
        return pool;
      })
    );
    setJoinedPoolId(poolId);
  };

  return (
    <div className="space-y-6">
      
      {/* Feature Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Truck className="w-3.5 h-3.5 mr-1" /> DYNAMIC FLEET CONSOLIDATION
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Shared Freight Pooling Engine
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
              {language === 'ta' 
                ? 'பகிர்வு வாகன ஒருங்கிணைப்பு (Shared Transport Matching)'
                : 'Collaborative Farm-Gate Shared Transport'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              {language === 'ta'
                ? 'ஒரே சந்தைக்கு செல்லும் விவசாயிகளை ஒன்றிணைத்து, தனித்தனி வாகன செலவை (₹2,400) குறைத்து, பகிர்வு வாகனத்தில் (₹1,400) ஒரு டன்னுக்கு ₹1,000 வரை சேமிக்கும் முறை.'
                : 'Consolidates smallholder partial loads (200kg - 500kg) heading to the same mandi into single shared mini-trucks to slash individual freight by over 40%.'}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center shrink-0">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Demonstrated Saving
            </div>
            <div className="text-2xl font-extrabold text-amber-900 font-mono flex items-center justify-center">
              -₹1,000 <span className="text-xs font-semibold text-amber-700 ml-1">/ trip</span>
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">
              Solo: ₹2,400 ➔ Pooled: ₹1,400
            </div>
          </div>
        </div>
      </div>

      {/* Active Pooling Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {pools.map((pool) => {
          const capacityPercent = Math.round((pool.bookedCapacityKg / pool.totalCapacityKg) * 100);
          const remainingKg = Math.max(0, pool.totalCapacityKg - pool.bookedCapacityKg);
          const isUserJoined = joinedPoolId === pool.id;

          return (
            <div
              key={pool.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all relative ${
                isUserJoined ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20' : 'border-stone-200'
              }`}
            >
              {/* Route & Vehicle */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{pool.vehicleType}</span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-stone-900">
                    {pool.route}
                  </h4>
                </div>
                <span className="text-xs font-semibold text-stone-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
                  {pool.departureTime.split(' ')[0]}
                </span>
              </div>

              {/* Progress Bar for Load Capacity */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-600">Truck Load Capacity:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {pool.bookedCapacityKg} / {pool.totalCapacityKg} kg ({capacityPercent}%)
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      capacityPercent >= 90 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>{remainingKg} kg space remaining</span>
                  <span className="text-emerald-700 font-semibold">Consolidated load ready</span>
                </div>
              </div>

              {/* Farmers in this load */}
              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                <div className="text-xs font-bold text-stone-700 flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-stone-500" />
                  <span>Farmers Pooled in this Vehicle ({pool.participants.length}):</span>
                </div>
                <div className="space-y-1.5">
                  {pool.participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100"
                    >
                      <div className="font-medium text-stone-800 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{p.farmerName}</span>
                        <span className="text-stone-400">({p.crop})</span>
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-stone-600">
                        {p.quantityKg} kg • {p.pickupPoint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost comparison & Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-stone-50/70 p-3 rounded-xl">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-stone-500">Your Shared Freight Cost:</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-extrabold text-emerald-800 font-mono">
                      ₹{pool.sharedCostForLoad}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      ₹{pool.soloCostForLoad} (Solo)
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Save ₹{pool.savings}
                    </span>
                  </div>
                </div>

                <div>
                  {isUserJoined ? (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Slot Locked in Vehicle</span>
                    </div>
                  ) : (
                    <button
                      id={`btn-join-pool-${pool.id}`}
                      onClick={() => handleJoinPool(pool.id)}
                      disabled={remainingKg <= 0}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs disabled:opacity-50"
                    >
                      <span>Join Load ({currentFarmerLoadKg} kg)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Driver and verification info */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {pool.driverName}
                </span>
                <span className="flex items-center text-stone-600 font-mono">
                  <PhoneCall className="w-3 h-3 mr-1 text-stone-400" />
                  {pool.driverPhone}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
