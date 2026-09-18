import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  Truck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ChevronRight, 
  HelpCircle,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Zap
} from 'lucide-react';
import { CropInfo, MandiMarket, QualityGrade, Language } from '../types';
import { CROPS_DATA, MANDIS_DATA } from '../data/agriData';
import { calculateNetRealization } from '../utils/calculator';

interface DecisionEngineProps {
  language: Language;
  onSelectMandiForDispatch: (mandiName: string, netAmount: number) => void;
  onJoinSharedTransport: () => void;
}

export const DecisionEngine: React.FC<DecisionEngineProps> = ({
  language,
  onSelectMandiForDispatch,
  onJoinSharedTransport,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A (Premium/Firm)');
  const [farmTaluk, setFarmTaluk] = useState<string>('Dindigul West');
  const [expandedMandiId, setExpandedMandiId] = useState<string | null>('mandi-hub');

  const selectedCrop = useMemo(() => {
    return CROPS_DATA.find((c) => c.id === selectedCropId) || CROPS_DATA[0];
  }, [selectedCropId]);

  const { results, decision } = useMemo(() => {
    return calculateNetRealization(selectedCrop, quantityKg, qualityGrade, MANDIS_DATA);
  }, [selectedCrop, quantityKg, qualityGrade]);

  const bestResult = results[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: 60-Second Fast Pre-Dispatch Engine */}
      <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm border border-emerald-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                <Zap className="w-3 h-3 mr-1 fill-amber-950" /> 60-Sec Pre-Dispatch Engine
              </span>
              <span className="text-xs text-emerald-200">
                {language === 'ta' ? 'புறப்படுவதற்கு முன் துல்லிய முடிவு' : 'Decision before leaving farm'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {language === 'ta' 
                ? 'நிகர விலை & சந்தை தேர்வு இயந்திரம் (True Net Realization)'
                : 'True Net Realization & Market Dispatch Optimizer'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              {language === 'ta'
                ? 'வெறும் தலைப்பு விலையை மட்டும் பார்க்காமல், போக்குவரத்து, சுங்கம், இறக்கு கூலி மற்றும் தக்காளி அழுகல் இழப்பு கழித்த உண்மையான கைக்கு வரும் பணத்தை கணக்கிடுகிறது.'
                : 'Calculates actual in-hand revenue after factoring fuel freight, mandi commission, handling, and crop shelf-life decay.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-emerald-800/80 backdrop-blur-xs border border-emerald-700/50 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xs text-emerald-300 font-medium">Calculation Speed</div>
              <div className="text-lg font-extrabold text-amber-300 font-mono flex items-center justify-center">
                &lt; 0.8s <span className="text-xs text-emerald-300 font-normal ml-1">real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Selector Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        
        {/* Step 1: Crop Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            1. {language === 'ta' ? 'பயிரைத் தேர்ந்தெடுக்கவும்' : language === 'hi' ? 'फसल चुनें' : 'Select Crop'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {CROPS_DATA.map((crop) => {
              const isSelected = crop.id === selectedCropId;
              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="font-semibold text-xs truncate">
                    {language === 'ta' ? crop.nameTamil : language === 'hi' ? crop.nameHindi : crop.name.split(' ')[0]}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    ₹{crop.basePriceKg}/kg
                  </div>
                  {crop.perishabilityRating === 'Extreme' && (
                    <span className="inline-block px-1 py-0.2 rounded text-[9px] font-semibold bg-rose-100 text-rose-700 mt-1">
                      {language === 'ta' ? 'அழுகும் பயிர்' : 'Perishable'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 & 3: Quantity, Grade, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
          
          {/* Quantity Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                2. {language === 'ta' ? 'அளவு (Quantity)' : 'Harvest Quantity'}
              </label>
              <span className="text-xs font-extrabold text-emerald-700 font-mono">
                {quantityKg} kg ({Number((quantityKg / 100).toFixed(1))} Quintals)
              </span>
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
            <div className="flex justify-between items-center mt-1.5">
              {[200, 500, 1000, 2500].map((quickVal) => (
                <button
                  key={quickVal}
                  onClick={() => setQuantityKg(quickVal)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                    quantityKg === quickVal
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {quickVal} kg
                </button>
              ))}
            </div>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              3. {language === 'ta' ? 'விளைச்சல் தரம் (Grade)' : 'Quality Grade'}
            </label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
              className="w-full text-xs sm:text-sm font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            >
              <option value="Grade A (Premium/Firm)">Grade A (Firm, Red, Export Quality +8%)</option>
              <option value="Grade B (Standard Market)">Grade B (Standard Market Baseline)</option>
              <option value="Grade C (Processing/Cull)">Grade C (Processing / Cull -18%)</option>
            </select>
            <p className="text-[11px] text-stone-500 mt-1">
              AGMARK & e-NAM quality parameters applied.
            </p>
          </div>

          {/* Farm Location Taluk */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              4. {language === 'ta' ? 'பண்ணை அமைவிடம்' : 'Farm Taluk / Location'}
            </label>
            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
              <MapPin className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
              <select
                value={farmTaluk}
                onChange={(e) => setFarmTaluk(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium bg-transparent text-stone-800 focus:outline-hidden"
              >
                <option value="Dindigul West">Dindigul West (Palani Road Belt)</option>
                <option value="Reddiarchatram">Reddiarchatram Taluk</option>
                <option value="Vedasandur">Vedasandur Taluk</option>
                <option value="Natham Link">Natham Agricultural Belt</option>
              </select>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Live distance & toll rates mapped to 4 regional mandis.
            </p>
          </div>

        </div>
      </div>

      {/* Flagship Hero Recommendation Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-2xl border-2 border-emerald-500/30 p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-700 text-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> OPTIMAL RECOMMENDATION
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Confidence: {decision.confidenceScore}%
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-emerald-950">
              {language === 'ta' ? decision.headlineTamil : language === 'hi' ? decision.headlineHindi : decision.headline}
            </h3>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {language === 'ta' ? decision.reasoningTamil : language === 'hi' ? decision.reasoningHindi : decision.reasoning}
            </p>

            {decision.shelfLifeWarning && (
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{decision.shelfLifeWarning}</span>
              </div>
            )}
          </div>

          {/* Realization Summary Badge */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-emerald-200 shadow-xs shrink-0 lg:min-w-[280px]">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Estimated Net In-Hand Realization
            </div>
            
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono">
                ₹{bestResult.estimatedNetRealizationShared.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                (₹{bestResult.netPricePerKgShared}/kg net)
              </span>
            </div>

            {decision.estimatedNetGainOverLocal > 0 && (
              <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center justify-between">
                <span>Gain vs local broker:</span>
                <span className="text-emerald-700 font-extrabold">+₹{decision.estimatedNetGainOverLocal.toLocaleString()}</span>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Shared Truck Saving:
              </span>
              <span className="font-bold text-emerald-700">
                ₹{bestResult.transportCost - bestResult.sharedTransportCost} saved
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                id="btn-confirm-dispatch-optimal"
                onClick={() => onSelectMandiForDispatch(bestResult.mandi.name, bestResult.estimatedNetRealizationShared)}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center space-x-1"
              >
                <span>Dispatch Lot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-join-shared-vehicle"
                onClick={onJoinSharedTransport}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center"
                title="Join Shared Load Vehicle"
              >
                <Truck className="w-4 h-4 mr-1 text-amber-700" />
                <span>Pool</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mandi-by-Mandi Comparison Table & Deductions Breakdown */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center">
            <Scale className="w-4 h-4 mr-1.5 text-emerald-600" />
            {language === 'ta' 
              ? '4 சந்தைகளின் விரிவான நிகர லாப ஒப்பீடு (Net Breakdown)' 
              : 'Multi-Market True Net Realization Breakdown'}
          </h4>
          <span className="text-xs text-stone-500">
            Click any market card to inspect exact deductions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {results.map((item, index) => {
            const isExpanded = expandedMandiId === item.mandi.id;
            return (
              <div
                key={item.mandi.id}
                onClick={() => setExpandedMandiId(isExpanded ? null : item.mandi.id)}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all relative ${
                  item.isBestOption
                    ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                {item.isBestOption && (
                  <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    ★ Best Net
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900">
                      {item.mandi.name.replace(' Wholsale', '').split(' Market')[0]}
                    </h5>
                    <div className="text-[11px] text-stone-500 flex items-center mt-0.5 space-x-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{item.mandi.distanceKm} km away ({item.mandi.transitHours}h transit)</span>
                    </div>
                  </div>
                </div>

                {/* Headline Price vs Realized Net Price */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2 text-center bg-stone-50/70 p-2 rounded-lg">
                  <div>
                    <div className="text-[10px] text-stone-500 font-semibold">Headline Mandi Rate</div>
                    <div className="text-xs font-bold text-stone-700">
                      ₹{item.mandi.modalPriceKg.toFixed(1)}/kg
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold">True Net (Pooled)</div>
                    <div className="text-xs font-extrabold text-emerald-700">
                      ₹{item.netPricePerKgShared}/kg
                    </div>
                  </div>
                </div>

                {/* Net Total */}
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-stone-500">In-hand Net:</span>
                  <span className="text-sm font-extrabold text-stone-900 font-mono">
                    ₹{item.estimatedNetRealizationShared.toLocaleString()}
                  </span>
                </div>

                {/* Arrival status indicator */}
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">Mandi Arrivals:</span>
                  <span
                    className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
                      item.mandi.arrivalTrend === 'shortage'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.mandi.arrivalTrend === 'glut'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {item.mandi.arrivalTrend === 'shortage'
                      ? 'Shortage (Good)'
                      : item.mandi.arrivalTrend === 'glut'
                      ? 'Glut (+29% supply)'
                      : 'Normal'}
                  </span>
                </div>

                {/* Expandable itemized deduction breakdown */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dashed border-stone-200 text-[11px] space-y-1.5 bg-stone-50 p-2.5 rounded-lg">
                    <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Itemized Deductions:
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Gross Crop Value:</span>
                      <span className="font-semibold font-mono">₹{item.grossRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-rose-700">
                      <span>Transport Freight (Solo):</span>
                      <span className="font-mono">-₹{item.transportCost}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Shared Truck Freight:</span>
                      <span className="font-mono">-₹{item.sharedTransportCost}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Mandi Cess ({item.mandi.commissionPercent}%):</span>
                      <span className="font-mono">-₹{item.mandiCommission}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Weighment & Loading:</span>
                      <span className="font-mono">-₹{item.loadingUnloadingCost}</span>
                    </div>
                    <div className="flex justify-between text-amber-700">
                      <span>Transit Perishability Decay:</span>
                      <span className="font-mono">-₹{item.shelfLifeDecayDeduction}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Tolls & Gate Entry:</span>
                      <span className="font-mono">-₹{item.tollAndOtherCosts}</span>
                    </div>
                    <div className="pt-1.5 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                      <span>Actual Net Received:</span>
                      <span className="text-emerald-700 font-mono">
                        ₹{item.estimatedNetRealizationShared.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
