import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Scale, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Layers, 
  ChevronRight, 
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Percent,
  Calculator
} from 'lucide-react';
import { Language, QualityGrade, CropInfo } from '../types';
import { CROPS_DATA, MANDIS_DATA } from '../data/agriData';

interface NetRealizationEngineProps {
  language: Language;
}

interface SellingOptionEvaluation {
  id: string;
  name: string;
  channelType: 'Regional Wholesale Hub' | 'Direct Institutional Buyer' | 'Local Taluk Mandi' | 'Cold Storage Hold';
  headlineGrossRateKg: number;
  grossCropValue: number;
  deductions: {
    transportCost: number;
    qualityDockage: number;
    mandiCommission: number;
    loadingWeighment: number;
    storageFee: number;
    transitDecayLoss: number;
    tollsAndGate: number;
  };
  totalDeductions: number;
  netInHandAmount: number;
  netPricePerKg: number;
  isBestOption: boolean;
  notes: string;
  badge: string;
}

export const NetRealizationEngine: React.FC<NetRealizationEngineProps> = ({ language }) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [quantityKg, setQuantityKg] = useState<number>(1000);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A (Premium/Firm)');
  const [moistureDockagePercent, setMoistureDockagePercent] = useState<number>(2.0); // 2% dockage
  const [useSharedTransport, setUseSharedTransport] = useState<boolean>(true);
  const [storageHoldingDays, setStorageHoldingDays] = useState<number>(7);

  const selectedCrop = useMemo(() => {
    return CROPS_DATA.find((c) => c.id === selectedCropId) || CROPS_DATA[0];
  }, [selectedCropId]);

  // Quality multiplier
  const gradeMultiplier = useMemo(() => {
    switch (qualityGrade) {
      case 'Grade A (Premium/Firm)':
        return 1.08;
      case 'Grade B (Standard Market)':
        return 1.0;
      case 'Grade C (Processing/Cull)':
        return 0.82;
      default:
        return 1.0;
    }
  }, [qualityGrade]);

  // Evaluate 4 distinct selling options
  const options: SellingOptionEvaluation[] = useMemo(() => {
    const quintals = quantityKg / 100;
    const baseKgPrice = selectedCrop.basePriceKg * gradeMultiplier;

    // --- Option 1: Regional Wholesale Hub (Oddanchatram Central) ---
    const opt1HeadlineRate = baseKgPrice + 2.5; // Premium market
    const opt1Gross = Math.round(opt1HeadlineRate * quantityKg);
    const opt1Transport = useSharedTransport ? 1400 : 2600;
    const opt1Dockage = Math.round((opt1Gross * moistureDockagePercent) / 100);
    const opt1Commission = Math.round(opt1Gross * 0.015); // 1.5% APMC cess
    const opt1Loading = Math.round(quintals * 15);
    const opt1Storage = 0;
    const opt1Decay = Math.round(opt1Gross * 0.025); // 2.5% transit decay
    const opt1Tolls = 80;
    const opt1TotalDeductions = opt1Transport + opt1Dockage + opt1Commission + opt1Loading + opt1Storage + opt1Decay + opt1Tolls;
    const opt1Net = opt1Gross - opt1TotalDeductions;

    // --- Option 2: Direct Institutional Contract (Reliance Fresh / WayCool) ---
    const opt2HeadlineRate = baseKgPrice + 1.2; // Fixed contract rate
    const opt2Gross = Math.round(opt2HeadlineRate * quantityKg);
    const opt2Transport = 1800; // Farm-gate aggregator collection
    const opt2Dockage = Math.round((opt2Gross * (moistureDockagePercent * 0.8)) / 100);
    const opt2Commission = 0; // ZERO commission for direct procurement!
    const opt2Loading = 0; // Buyer handles loading
    const opt2Storage = 0;
    const opt2Decay = Math.round(opt2Gross * 0.01); // Climate controlled van
    const opt2Tolls = 0;
    const opt2TotalDeductions = opt2Transport + opt2Dockage + opt2Commission + opt2Loading + opt2Storage + opt2Decay + opt2Tolls;
    const opt2Net = opt2Gross - opt2TotalDeductions;

    // --- Option 3: Local Taluk Mandi (Dindigul APMC) ---
    const opt3HeadlineRate = baseKgPrice - 3.5; // Distressed by local glut
    const opt3Gross = Math.round(opt3HeadlineRate * quantityKg);
    const opt3Transport = 800; // Short 12 km trip
    const opt3Dockage = Math.round((opt3Gross * (moistureDockagePercent * 1.2)) / 100);
    const opt3Commission = Math.round(opt3Gross * 0.02); // 2% commission
    const opt3Loading = Math.round(quintals * 20);
    const opt3Storage = 0;
    const opt3Decay = Math.round(opt3Gross * 0.01);
    const opt3Tolls = 0;
    const opt3TotalDeductions = opt3Transport + opt3Dockage + opt3Commission + opt3Loading + opt3Storage + opt3Decay + opt3Tolls;
    const opt3Net = opt3Gross - opt3TotalDeductions;

    // --- Option 4: Cold Storage Facility Hold ---
    const expectedFutureRate = baseKgPrice + 6.0; // Higher price after holding
    const opt4Gross = Math.round(expectedFutureRate * quantityKg);
    const opt4Transport = 1200;
    const opt4Dockage = Math.round((opt4Gross * moistureDockagePercent) / 100);
    const opt4Commission = 0;
    const opt4Loading = Math.round(quintals * 30); // in and out handling
    const opt4Storage = Math.round(quintals * selectedCrop.coldStorageCostPerDayPerQuintal * storageHoldingDays);
    const opt4Decay = Math.round(opt4Gross * (selectedCrop.perishabilityRating === 'Extreme' ? 0.22 : 0.04));
    const opt4Tolls = 50;
    const opt4TotalDeductions = opt4Transport + opt4Dockage + opt4Commission + opt4Loading + opt4Storage + opt4Decay + opt4Tolls;
    const opt4Net = opt4Gross - opt4TotalDeductions;

    const list: SellingOptionEvaluation[] = [
      {
        id: 'opt-regional-hub',
        name: 'Oddanchatram Regional Wholesale Hub',
        channelType: 'Regional Wholesale Hub',
        headlineGrossRateKg: Number(opt1HeadlineRate.toFixed(1)),
        grossCropValue: opt1Gross,
        deductions: {
          transportCost: opt1Transport,
          qualityDockage: opt1Dockage,
          mandiCommission: opt1Commission,
          loadingWeighment: opt1Loading,
          storageFee: opt1Storage,
          transitDecayLoss: opt1Decay,
          tollsAndGate: opt1Tolls,
        },
        totalDeductions: opt1TotalDeductions,
        netInHandAmount: opt1Net,
        netPricePerKg: Number((opt1Net / quantityKg).toFixed(1)),
        isBestOption: false,
        notes: 'Highest auction liquidity and high net realization with shared truck.',
        badge: 'High Liquidity',
      },
      {
        id: 'opt-direct-buyer',
        name: 'Direct Institutional Contract (Apex Retail)',
        channelType: 'Direct Institutional Buyer',
        headlineGrossRateKg: Number(opt2HeadlineRate.toFixed(1)),
        grossCropValue: opt2Gross,
        deductions: {
          transportCost: opt2Transport,
          qualityDockage: opt2Dockage,
          mandiCommission: opt2Commission,
          loadingWeighment: opt2Loading,
          storageFee: opt2Storage,
          transitDecayLoss: opt2Decay,
          tollsAndGate: opt2Tolls,
        },
        totalDeductions: opt2TotalDeductions,
        netInHandAmount: opt2Net,
        netPricePerKg: Number((opt2Net / quantityKg).toFixed(1)),
        isBestOption: false,
        notes: 'Zero commission and zero handling fees; guaranteed T+1 payment.',
        badge: 'Zero Commission',
      },
      {
        id: 'opt-local-mandi',
        name: 'Dindigul Local APMC Mandi',
        channelType: 'Local Taluk Mandi',
        headlineGrossRateKg: Number(opt3HeadlineRate.toFixed(1)),
        grossCropValue: opt3Gross,
        deductions: {
          transportCost: opt3Transport,
          qualityDockage: opt3Dockage,
          mandiCommission: opt3Commission,
          loadingWeighment: opt3Loading,
          storageFee: opt3Storage,
          transitDecayLoss: opt3Decay,
          tollsAndGate: opt3Tolls,
        },
        totalDeductions: opt3TotalDeductions,
        netInHandAmount: opt3Net,
        netPricePerKg: Number((opt3Net / quantityKg).toFixed(1)),
        isBestOption: false,
        notes: 'Lowest transport cost, but localized glut severely discounts headline price.',
        badge: 'Short Distance',
      },
      {
        id: 'opt-cold-storage',
        name: `Cold Storage Hold (${storageHoldingDays} Days)`,
        channelType: 'Cold Storage Hold',
        headlineGrossRateKg: Number(expectedFutureRate.toFixed(1)),
        grossCropValue: opt4Gross,
        deductions: {
          transportCost: opt4Transport,
          qualityDockage: opt4Dockage,
          mandiCommission: opt4Commission,
          loadingWeighment: opt4Loading,
          storageFee: opt4Storage,
          transitDecayLoss: opt4Decay,
          tollsAndGate: opt4Tolls,
        },
        totalDeductions: opt4TotalDeductions,
        netInHandAmount: opt4Net,
        netPricePerKg: Number((opt4Net / quantityKg).toFixed(1)),
        isBestOption: false,
        notes: selectedCrop.coldStorageFeasible
          ? 'Viable holding strategy for hard horticultural crops.'
          : '⚠️ Warning: Perishable crop decay erases speculative future gains.',
        badge: selectedCrop.coldStorageFeasible ? 'Safe to Hold' : 'Decay Risk',
      },
    ];

    // Mark best option
    let bestNet = -Infinity;
    let bestIdx = 0;
    list.forEach((item, idx) => {
      if (item.netInHandAmount > bestNet) {
        bestNet = item.netInHandAmount;
        bestIdx = idx;
      }
    });
    list[bestIdx].isBestOption = true;

    return list;
  }, [selectedCrop, quantityKg, gradeMultiplier, moistureDockagePercent, useSharedTransport, storageHoldingDays]);

  const bestOption = options.find((o) => o.isBestOption) || options[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wide shadow-xs">
                <Calculator className="w-3.5 h-3.5 mr-1 fill-amber-950" /> Net Realization Engine
              </span>
              <span className="text-xs text-emerald-200">
                True In-Hand Net Calculation
              </span>
            </div>
            
            <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-white">
              {language === 'ta' 
                ? 'உண்மையான நிகர வருவாய் கணக்கீட்டு இயந்திரம்' 
                : 'True Net Realization & Selling Option Analyzer'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {language === 'ta'
                ? 'வெறும் தலைப்பு விலையை மட்டும் பார்க்காமல், போக்குவரத்து, சேமிப்பு, தரம் குறைப்பு, தரகுக் கட்டணம் மற்றும் அழுகல் இழப்புகளைக் கழித்து விவசாயியின் கைக்கு வரும் நிகரத் தொகையைத் துல்லியமாக ஒப்பிடுகிறது.'
                : 'Calculates the real in-pocket amount a farmer retains after factoring in selling price, transport freight, cold storage charges, quality grading deductions, mandi commissions, and perishability decay.'}
            </p>
          </div>

          {/* Prominent Best Net Hero Card */}
          <div className="bg-white text-stone-900 p-5 rounded-3xl shadow-xl shrink-0 border-2 border-emerald-500 min-w-[280px]">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              <span>Optimal Selling Channel</span>
              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                ★ Best Net
              </span>
            </div>
            
            <div className="text-base font-extrabold text-stone-900 mt-1 truncate">
              {bestOption.name.split(' (')[0]}
            </div>

            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono">
                ₹{bestOption.netInHandAmount.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-stone-500">
                (₹{bestOption.netPricePerKg}/kg Net)
              </span>
            </div>

            <div className="mt-2 text-xs text-stone-600 bg-stone-50 p-2 rounded-xl border border-stone-100 flex justify-between">
              <span>Gross Value:</span>
              <span className="font-semibold font-mono">₹{bestOption.grossCropValue.toLocaleString()}</span>
            </div>
            <div className="mt-1 text-xs text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-100 flex justify-between">
              <span>Total Deductions:</span>
              <span className="font-semibold font-mono">-₹{bestOption.totalDeductions.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Crop, Quantity, Grade, Dockage, Transport */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        
        {/* Step 1: Crop Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            1. Select Harvest Crop:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {CROPS_DATA.map((crop) => (
              <button
                key={crop.id}
                onClick={() => setSelectedCropId(crop.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedCropId === crop.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                }`}
              >
                <div className="font-bold text-xs truncate">{crop.name.split(' ')[0]}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">₹{crop.basePriceKg}/kg</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Sliders for Quantity, Quality Grade, Moisture Dockage, Shared Transport */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-stone-100 text-xs">
          
          {/* Quantity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-stone-700">
              <span>Harvest Volume:</span>
              <span className="font-mono text-emerald-700">{quantityKg} kg</span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={50}
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>100 kg</span>
              <span>5,000 kg</span>
            </div>
          </div>

          {/* Quality Grade Select */}
          <div className="space-y-1">
            <label className="block font-bold text-stone-700">Quality Grade (Assaying):</label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 font-medium text-stone-800"
            >
              <option value="Grade A (Premium/Firm)">Grade A (Firm, Red +8%)</option>
              <option value="Grade B (Standard Market)">Grade B (Standard Market)</option>
              <option value="Grade C (Processing/Cull)">Grade C (Processing -18%)</option>
            </select>
          </div>

          {/* Moisture Dockage Slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-stone-700">
              <span>Moisture / Foreign Dockage:</span>
              <span className="font-mono text-amber-700">{moistureDockagePercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={moistureDockagePercent}
              onChange={(e) => setMoistureDockagePercent(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0% (Clean)</span>
              <span>10% (High moisture)</span>
            </div>
          </div>

          {/* Transport Mode Toggle */}
          <div className="space-y-1">
            <label className="block font-bold text-stone-700">Freight Logistics Mode:</label>
            <div className="flex space-x-1 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setUseSharedTransport(true)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] ${
                  useSharedTransport ? 'bg-emerald-700 text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                Shared Vehicle
              </button>
              <button
                onClick={() => setUseSharedTransport(false)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] ${
                  !useSharedTransport ? 'bg-stone-700 text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                Solo Hired Truck
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Prominent Side-by-Side Comparison of 4 Selling Channels */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-sm sm:text-base font-bold text-stone-800 uppercase tracking-wider flex items-center">
            <Scale className="w-4 h-4 mr-1.5 text-emerald-600" />
            Prominent Comparison Across 4 Selling Options (Net Received)
          </h3>
          <span className="text-xs text-stone-500">
            All transaction fees, freight, and quality deductions included
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {options.map((opt) => (
            <motion.div
              key={opt.id}
              layout
              className={`rounded-3xl border p-5 transition-all relative flex flex-col justify-between ${
                opt.isBestOption
                  ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/20 shadow-lg'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              {opt.isBestOption && (
                <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  ★ HIGHEST NET REALIZATION
                </span>
              )}

              <div className="space-y-3">
                
                {/* Header */}
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase">
                    {opt.badge}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-stone-900 mt-1.5 leading-snug">
                    {opt.name}
                  </h4>
                  <div className="text-[11px] text-stone-500 mt-0.5">{opt.channelType}</div>
                </div>

                {/* Prominent Net Amount Display */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-center space-y-1">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Estimated Net In-Hand
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
                    ₹{opt.netInHandAmount.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-stone-700">
                    ₹{opt.netPricePerKg}/kg Net <span className="text-stone-400 font-normal">(Headline: ₹{opt.headlineGrossRateKg}/kg)</span>
                  </div>
                </div>

                {/* Itemized Deductions Ledger */}
                <div className="space-y-1.5 text-xs pt-2 border-t border-stone-100">
                  <div className="flex justify-between text-stone-600">
                    <span>Gross Value:</span>
                    <span className="font-mono font-semibold">₹{opt.grossCropValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Transport Cost:</span>
                    <span className="font-mono">-₹{opt.deductions.transportCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Quality/Moisture Dock:</span>
                    <span className="font-mono">-₹{opt.deductions.qualityDockage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Mandi Commission:</span>
                    <span className="font-mono">-₹{opt.deductions.mandiCommission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Handling / Weighment:</span>
                    <span className="font-mono">-₹{opt.deductions.loadingWeighment.toLocaleString()}</span>
                  </div>
                  {opt.deductions.storageFee > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Cold Storage Rent:</span>
                      <span className="font-mono">-₹{opt.deductions.storageFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-700">
                    <span>Transit Spoilage Loss:</span>
                    <span className="font-mono">-₹{opt.deductions.transitDecayLoss.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Note & Action */}
              <div className="pt-3 border-t border-stone-100 mt-4 space-y-2">
                <p className="text-[11px] text-stone-500 italic leading-snug">
                  {opt.notes}
                </p>
                <button
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    opt.isBestOption
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Select This Channel
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
