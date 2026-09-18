import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Truck,
  ExternalLink,
  Info
} from 'lucide-react';
import { MandiMarket, Language } from '../types';
import { MANDIS_DATA } from '../data/agriData';

interface MarketRouteOptimizerProps {
  language: Language;
}

export const MarketRouteOptimizer: React.FC<MarketRouteOptimizerProps> = ({ language }) => {
  const [selectedMandi, setSelectedMandi] = useState<MandiMarket>(MANDIS_DATA[1]); // Default to Oddanchatram

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                <Navigation className="w-3.5 h-3.5 mr-1" /> CORRIDOR TELEMETRY
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Market Route & Arrival Analytics
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
              {language === 'ta' 
                ? 'சந்தை வழித்தட & வரத்து கண்காணிப்பான் (Route & Arrival Optimizer)'
                : 'Mandi Arrival Volumes & Distance-to-Net Optimizer'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              {language === 'ta'
                ? 'அருகிலுள்ள சந்தைகளில் இன்றைய வரத்து நிலவரம் (அதிக வரத்து / பற்றாக்குறை) மற்றும் தூரம், டீசல் செலவுகளை ஒப்பிட்டு தேவையற்ற அலைச்சலை தவிர்க்கிறது.'
                : 'Compares real-time mandi arrival surges (gluts vs supply crunches), distance, and road transit times to stop farmers from heading into flooded markets.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Regional Mandis Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MANDIS_DATA.map((mandi) => {
          const isSelected = selectedMandi.id === mandi.id;
          const arrivalDeltaPercent = Math.round(
            ((mandi.todayArrivalsTons - mandi.normalAvgArrivalsTons) / mandi.normalAvgArrivalsTons) * 100
          );

          return (
            <div
              key={mandi.id}
              onClick={() => setSelectedMandi(mandi)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                isSelected
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    {mandi.district}, {mandi.state}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mt-0.5">
                    {mandi.name.replace(' Wholesale Terminal', '').replace(' Vegetable Market', '')}
                  </h4>
                </div>
                {mandi.eNamLinked && (
                  <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                    e-NAM
                  </span>
                )}
              </div>

              {/* Price & Transit */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-stone-500">Live Modal Rate</div>
                  <div className="font-extrabold text-stone-900 font-mono text-sm">
                    ₹{mandi.modalPriceKg.toFixed(1)}/kg
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">Distance / Time</div>
                  <div className="font-semibold text-stone-700">
                    {mandi.distanceKm} km • {mandi.transitHours}h
                  </div>
                </div>
              </div>

              {/* Arrival Volume Signal Badge */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 text-[11px]">Arrival Signal:</span>
                <span
                  className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                    mandi.arrivalTrend === 'shortage'
                      ? 'bg-emerald-100 text-emerald-800'
                      : mandi.arrivalTrend === 'glut'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {mandi.arrivalTrend === 'shortage'
                    ? `Shortage (${arrivalDeltaPercent}%)`
                    : mandi.arrivalTrend === 'glut'
                    ? `Glut (+${arrivalDeltaPercent}%)`
                    : 'Balanced'}
                </span>
              </div>

              {/* Verified Buyers */}
              <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
                <span>Active Traded Lots:</span>
                <span className="font-semibold text-stone-700">{mandi.verifiedBuyersCount} Buyers Active</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Mandi Deep Dive Box */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div className="text-xs text-stone-500">Detailed Route Intelligence:</div>
            <h4 className="text-lg font-bold text-stone-900">{selectedMandi.name}</h4>
          </div>
          <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl font-medium">
            Local Name: <span className="font-bold text-stone-900">{selectedMandi.nameLocal}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold">Today's Total Arrivals</div>
            <div className="text-lg font-extrabold text-stone-900 font-mono mt-1">
              {selectedMandi.todayArrivalsTons} Tons
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Historical Avg: {selectedMandi.normalAvgArrivalsTons} Tons
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold">APMC Cess & Commission</div>
            <div className="text-lg font-extrabold text-stone-900 font-mono mt-1">
              {selectedMandi.commissionPercent}%
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Loading/Weighment: ₹{selectedMandi.loadingCostPerQuintal}/quintal
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold">Toll & Gate Charges</div>
            <div className="text-lg font-extrabold text-stone-900 font-mono mt-1">
              ₹{selectedMandi.tollAndGateCharges}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Round-trip highway entry
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold">Auction Trading Window</div>
            <div className="text-lg font-extrabold text-emerald-800 font-mono mt-1">
              05:00 AM - 11:30 AM
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Evening session: 04:30 PM - 07:00 PM
            </div>
          </div>
        </div>

        {/* Why this market matters note */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>FarmFlow AI Dispatch Note:</strong> If your harvest is ready before 03:00 PM, joining the Oddanchatram Central evening auction gives direct access to Kerala & Karnataka interstate procurement trucks that pay a premium for firm Grade A lots.
          </p>
        </div>

      </div>

    </div>
  );
};
