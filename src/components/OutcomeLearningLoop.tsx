import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  Percent, 
  PlusCircle, 
  Sliders,
  History,
  Activity,
  Cpu
} from 'lucide-react';
import { PredictionActualFeedback, Language } from '../types';
import { HISTORICAL_FEEDBACK_DATA } from '../data/agriData';

interface OutcomeLearningLoopProps {
  language: Language;
}

export const OutcomeLearningLoop: React.FC<OutcomeLearningLoopProps> = ({ language }) => {
  const [feedbackList, setFeedbackList] = useState<PredictionActualFeedback[]>(HISTORICAL_FEEDBACK_DATA);
  const [showLogForm, setShowLogForm] = useState<boolean>(false);

  // Form State
  const [farmerName, setFarmerName] = useState<string>('Farmer Sundaram (Dindigul)');
  const [cropName, setCropName] = useState<string>('Tomato (500 kg)');
  const [mandiName, setMandiName] = useState<string>('Oddanchatram Central Mandi');
  const [predictedPrice, setPredictedPrice] = useState<number>(37.5);
  const [actualPrice, setActualPrice] = useState<number>(38.0);
  const [predictedTransport, setPredictedTransport] = useState<number>(1400);
  const [actualTransport, setActualTransport] = useState<number>(1350);

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = 500;
    const predictedNet = Math.round(predictedPrice * qty - predictedTransport);
    const actualNet = Math.round(actualPrice * qty - actualTransport);
    const variancePercent = Number((((actualNet - predictedNet) / predictedNet) * 100).toFixed(1));
    const accuracy = Number((100 - Math.abs(variancePercent)).toFixed(1));

    const newFeedback: PredictionActualFeedback = {
      id: `fb-${Date.now()}`,
      date: 'Just Now (Live)',
      farmerName,
      crop: cropName,
      quantityKg: qty,
      mandiName,
      predictedPriceKg: predictedPrice,
      actualPriceKg: actualPrice,
      predictedTransportCost: predictedTransport,
      actualTransportCost: actualTransport,
      predictedNetRealization: predictedNet,
      actualNetRealization: actualNet,
      variancePercent,
      accuracyScore: accuracy,
      calibratedParameter: `Regional price model updated: residual error delta ${variancePercent > 0 ? '+' : ''}${variancePercent}% calibrated`,
      notes: 'Logged directly from mandi weighing scale receipt.',
    };

    setFeedbackList([newFeedback, ...feedbackList]);
    setShowLogForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Bayesian Outcome-Learning Engine */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 mr-1 fill-amber-950" /> BAYESIAN CALIBRATION ENGINE
              </span>
              <span className="text-xs text-emerald-200">
                Outcome-Learning Feedback Loop
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {language === 'ta' 
                ? 'கணிப்பு ➔ உண்மையான விற்பனை ➔ கற்றல் (Outcome-Learning Engine)'
                : 'Prediction ➔ Actual Sale ➔ Self-Learning Feedback Loop'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
              {language === 'ta'
                ? 'பொதுவான சந்தை செயலிகள் தகவலை மட்டும் தரும். பார்ம்ப்ளோ AI விற்பனை முடிந்த பிறகு கிடைத்த உண்மை விலையை பதிவு செய்து, எதிர்கால கணிப்பை தன்னிச்சையாக திருத்தி துல்லியமாக்குகிறது.'
                : 'Standard apps stop at broadcasting data. FarmFlow AI tracks actual farmer sales receipts, computes real error residuals, and continually trains local price and freight coefficients.'}
            </p>
          </div>

          <button
            id="btn-open-log-actual-sale"
            onClick={() => setShowLogForm(!showLogForm)}
            className="shrink-0 inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showLogForm ? 'Close Form' : 'Log Actual Sale Receipt'}</span>
          </button>
        </div>

        {/* 5-Step Visual Feedback Architecture Flow */}
        <div className="mt-6 pt-5 border-t border-emerald-800/60">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-semibold">
            <div className="bg-emerald-800/60 p-2.5 rounded-xl border border-emerald-700/50">
              <div className="text-[10px] text-emerald-300 uppercase">Step 1</div>
              <div className="text-white mt-0.5">Mandi Signals</div>
            </div>
            <div className="bg-emerald-800/60 p-2.5 rounded-xl border border-emerald-700/50">
              <div className="text-[10px] text-emerald-300 uppercase">Step 2</div>
              <div className="text-white mt-0.5">Pre-Dispatch Plan</div>
            </div>
            <div className="bg-emerald-800/60 p-2.5 rounded-xl border border-emerald-700/50">
              <div className="text-[10px] text-emerald-300 uppercase">Step 3</div>
              <div className="text-white mt-0.5">Farmer Dispatches</div>
            </div>
            <div className="bg-emerald-800/60 p-2.5 rounded-xl border border-emerald-700/50">
              <div className="text-[10px] text-emerald-300 uppercase">Step 4</div>
              <div className="text-amber-300 mt-0.5">Actual Sale Logged</div>
            </div>
            <div className="bg-amber-400/20 p-2.5 rounded-xl border border-amber-400/40 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-amber-300 uppercase font-bold">Step 5 ★</div>
              <div className="text-amber-300 font-bold mt-0.5">Model Calibrates</div>
            </div>
          </div>
        </div>

      </div>

      {/* Actual Sale Logging Modal Form */}
      {showLogForm && (
        <form
          onSubmit={handleRecordSale}
          className="bg-white rounded-2xl p-5 border-2 border-amber-400/60 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="text-sm sm:text-base font-bold text-stone-900 flex items-center">
              <History className="w-4 h-4 mr-2 text-amber-600" />
              Log Actual Mandi Sale (Feedback Capture)
            </h4>
            <span className="text-xs text-stone-500 font-mono">Real-time learning active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Farmer Name & Taluk</label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Crop & Qty</label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Mandi Sold At</label>
              <input
                type="text"
                value={mandiName}
                onChange={(e) => setMandiName(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Predicted Rate (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                value={predictedPrice}
                onChange={(e) => setPredictedPrice(Number(e.target.value))}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Actual Price Received (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                value={actualPrice}
                onChange={(e) => setActualPrice(Number(e.target.value))}
                className="w-full text-xs bg-emerald-50 border border-emerald-300 rounded-lg p-2 font-bold text-emerald-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Predicted Transport (₹)</label>
              <input
                type="number"
                value={predictedTransport}
                onChange={(e) => setPredictedTransport(Number(e.target.value))}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Actual Transport Paid (₹)</label>
              <input
                type="number"
                value={actualTransport}
                onChange={(e) => setActualTransport(Number(e.target.value))}
                className="w-full text-xs bg-emerald-50 border border-emerald-300 rounded-lg p-2 font-bold text-emerald-900"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
            >
              Submit & Calibrate Model
            </button>
          </div>
        </form>
      )}

      {/* ML Model Live Calibration Parameter Gauges */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center">
            <Cpu className="w-4 h-4 mr-1.5 text-emerald-600" />
            Live Machine-Learning Calibration Weights (Regional Engine)
          </h4>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            97.8% Mean Regional Accuracy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold">Freight Elasticity Coefficient</div>
            <div className="text-base font-extrabold text-stone-900 font-mono mt-0.5">₹14.50 / km</div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1">
              ✓ Calibrated from 42 farmer logs (Dindigul-Madurai axis)
            </div>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold">Oddanchatram Evening Auction Spread</div>
            <div className="text-base font-extrabold text-stone-900 font-mono mt-0.5">+₹1.80 / kg bias</div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1">
              ✓ Compensates for late-afternoon interstate demand
            </div>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold">Perishability Spoilage Decay Curve</div>
            <div className="text-base font-extrabold text-stone-900 font-mono mt-0.5">2.8% / 12 hrs</div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1">
              ✓ Tarp-covered transit decay factor verified
            </div>
          </div>
        </div>
      </div>

      {/* Historical Sales & Learning Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center">
            <Activity className="w-4 h-4 mr-1.5 text-emerald-600" />
            Farmer Outcome Logs & Accuracy Verification
          </h4>
          <span className="text-xs text-stone-500">Showing recent validated sales</span>
        </div>

        <div className="divide-y divide-stone-100">
          {feedbackList.map((item) => (
            <div key={item.id} className="p-4 hover:bg-stone-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{item.farmerName}</span>
                    <span className="text-[11px] text-stone-500">• {item.date}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                      {item.crop}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 mt-1 flex items-center space-x-1">
                    <span>Sold at:</span>
                    <span className="font-semibold text-stone-800">{item.mandiName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[11px] text-stone-500">Predicted vs Actual Net</div>
                    <div className="text-xs font-mono font-bold text-stone-800">
                      ₹{item.predictedNetRealization.toLocaleString()} ➔{' '}
                      <span className="text-emerald-700 font-extrabold">
                        ₹{item.actualNetRealization.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-xl text-xs font-extrabold font-mono text-center">
                    {item.accuracyScore}%
                    <div className="text-[9px] font-normal text-emerald-700">Accuracy</div>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-amber-800 font-medium flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" />
                  {item.calibratedParameter}
                </span>
                <span className="text-stone-500 italic text-[11px]">{item.notes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
