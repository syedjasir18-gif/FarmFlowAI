import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  HelpCircle,
  ThermometerSun,
  ShieldAlert
} from 'lucide-react';
import { CropInfo, Language } from '../types';
import { CROPS_DATA } from '../data/agriData';

interface ShelfLifeIntelligenceProps {
  language: Language;
}

export const ShelfLifeIntelligence: React.FC<ShelfLifeIntelligenceProps> = ({ language }) => {
  const [selectedCrop, setSelectedCrop] = useState<CropInfo>(CROPS_DATA[0]); // Tomato
  const [holdingDays, setHoldingDays] = useState<number>(3);
  const [speculativePriceRiseKg, setSpeculativePriceRiseKg] = useState<number>(2.0);
  const [storageCostPerDay, setStorageCostPerDay] = useState<number>(30);

  const quantityKg = 500;

  // Spoilage calculations
  const totalDecayPercent = Math.min(100, Number((selectedCrop.dailyDecayRatePercent * holdingDays).toFixed(1)));
  const lostWeightKg = Math.round((quantityKg * totalDecayPercent) / 100);
  const remainingWeightKg = quantityKg - lostWeightKg;

  // Financial impact
  const currentGross = selectedCrop.basePriceKg * quantityKg;
  const futurePricePerKg = selectedCrop.basePriceKg + speculativePriceRiseKg;
  const futureGross = futurePricePerKg * remainingWeightKg;
  const totalStorageFee = storageCostPerDay * holdingDays;
  const netHoldingGainOrLoss = Math.round(futureGross - totalStorageFee - currentGross);

  const isHoldingProfitable = netHoldingGainOrLoss > 0;

  return (
    <div className="space-y-6">
      
      {/* Feature Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5 mr-1" /> POST-HARVEST DECAY ENGINE
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Perishability & Shelf-Life Engine
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
              {language === 'ta' 
                ? 'அழுகல் அபாய & சேமிப்பு அறிவாற்றல் (Shelf-Life Intelligence)'
                : 'Crop Perishability & Hold-vs-Sell Simulator'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              {language === 'ta'
                ? 'விலை உயரும் என்று எதிர்பார்த்து தக்காளியை 3 நாட்கள் வைத்திருந்தால், அழுகல் மற்றும் எடை இழப்பால் லாபத்தை விட நஷ்டமே அதிகம் ஏற்படும் என்பதை முன்கூட்டியே எச்சரிக்கிறது.'
                : 'Prevents post-harvest disaster by calculating whether speculative price gains will be eaten away by moisture decay and spoilage rates.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulator Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-5">
        
        {/* Crop Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Select Crop for Perishability Analysis:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CROPS_DATA.slice(0, 4).map((crop) => (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedCrop.id === crop.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-xs">{crop.name}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Shelf-life: {crop.shelfLifeDays} days • Decay: {crop.dailyDecayRatePercent}%/day
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders for Simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-stone-100">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-stone-700">Days Farmer Considers Waiting:</span>
              <span className="font-mono text-emerald-700 font-bold">{holdingDays} Days</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={holdingDays}
              onChange={(e) => setHoldingDays(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
              <span>1 Day (Tomorrow)</span>
              <span>10 Days</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-stone-700">Anticipated Price Rise in Mandi:</span>
              <span className="font-mono text-emerald-700 font-bold">+₹{speculativePriceRiseKg.toFixed(1)}/kg</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={speculativePriceRiseKg}
              onChange={(e) => setSpeculativePriceRiseKg(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
              <span>₹0.0 (No change)</span>
              <span>+₹10.0/kg (High surge)</span>
            </div>
          </div>
        </div>

        {/* Simulation Output Banner */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            isHoldingProfitable
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/80 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {isHoldingProfitable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                )}
                <span className="font-extrabold text-sm sm:text-base">
                  {isHoldingProfitable
                    ? 'VERDICT: SAFE TO HOLD IN STORAGE'
                    : 'VERDICT: DO NOT WAIT — DISPATCH IMMEDIATELY TODAY!'}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90 max-w-xl">
                {isHoldingProfitable
                  ? `For ${selectedCrop.name}, holding ${holdingDays} days with a +₹${speculativePriceRiseKg}/kg price increase covers storage fees and minimal spoilage, netting an estimated +₹${netHoldingGainOrLoss.toLocaleString()}.`
                  : `Waiting ${holdingDays} days will cause an estimated ${totalDecayPercent}% moisture & rot decay (-${lostWeightKg} kg lost). The decay loss exceeds the speculative price rise by ₹${Math.abs(netHoldingGainOrLoss).toLocaleString()}.`}
              </p>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs shrink-0 sm:text-right min-w-[200px]">
              <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                Net Holding Outcome
              </div>
              <div
                className={`text-2xl font-extrabold font-mono mt-0.5 ${
                  isHoldingProfitable ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {netHoldingGainOrLoss > 0 ? `+₹${netHoldingGainOrLoss.toLocaleString()}` : `-₹${Math.abs(netHoldingGainOrLoss).toLocaleString()}`}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {lostWeightKg} kg physical weight loss
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
