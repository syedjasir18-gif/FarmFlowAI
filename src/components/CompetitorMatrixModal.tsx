import React from 'react';
import { 
  ExternalLink, 
  Search, 
  X, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Sparkles,
  Award
} from 'lucide-react';
import { COMPETITOR_PLATFORMS } from '../data/agriData';

interface CompetitorMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitorMatrixModal: React.FC<CompetitorMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-stone-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
                Industry Benchmark & Official Feeds
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 mt-1">
              Existing Agri-Market Portals & Official Links
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Direct access links and feature-by-feature gap analysis against FarmFlow AI.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Directory of all 8 Competitor Platforms with Google & Official Links */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            All 8 Researched Agri Platforms & Google Links:
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMPETITOR_PLATFORMS.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-emerald-300 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                      {item.type}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {item.tagline}
                    </p>
                  </div>
                </div>

                {/* Direct Google & Official Action Links */}
                <div className="flex items-center space-x-2 pt-1">
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Site</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                  </a>

                  <a
                    href={item.searchUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-stone-500" />
                    <span>Google Link</span>
                  </a>
                </div>

                {/* Gap & FarmFlow Advantage */}
                <div className="text-[11px] bg-white p-2 rounded-lg border border-stone-100 space-y-1">
                  <div className="text-stone-500 font-medium">
                    <strong>Limitation:</strong> {item.limitations[0]}
                  </div>
                  <div className="text-emerald-800 font-medium">
                    <strong>FarmFlow Advantage:</strong> {item.farmFlowAdvantage}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-stone-100 p-3 text-xs font-bold text-stone-800 uppercase tracking-wider">
            Enterprise Architecture & Industry Benchmark Matrix
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="p-3">Core Capability</th>
                  <th className="p-3">e-NAM / Agmarknet</th>
                  <th className="p-3">Mandi Intel / Buzzar</th>
                  <th className="p-3 bg-emerald-50 text-emerald-900 font-bold">FarmFlow AI (Ours)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="p-3 font-semibold">Pre-Dispatch Decision (Before leaving farm)</td>
                  <td className="p-3 text-rose-600">❌ Post-arrival only</td>
                  <td className="p-3 text-amber-600">⚠️ Basic price table</td>
                  <td className="p-3 bg-emerald-50 text-emerald-800 font-bold">✅ 60-Sec Decision Engine</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">True Net Realization (After transport & decay)</td>
                  <td className="p-3 text-rose-600">❌ Headline price only</td>
                  <td className="p-3 text-amber-600">⚠️ Simple distance</td>
                  <td className="p-3 bg-emerald-50 text-emerald-800 font-bold">✅ Full itemized net deduction</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Shared Transport / Load Pooling</td>
                  <td className="p-3 text-rose-600">❌ No load sharing</td>
                  <td className="p-3 text-rose-600">❌ Solo quotes only</td>
                  <td className="p-3 bg-emerald-50 text-emerald-800 font-bold">✅ Saves ₹1,000+ per truck</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Prediction ➔ Actual ➔ Learning Loop</td>
                  <td className="p-3 text-rose-600">❌ Static historical</td>
                  <td className="p-3 text-rose-600">❌ Fixed heuristic</td>
                  <td className="p-3 bg-emerald-50 text-emerald-800 font-bold">✅ Self-calibrating feedback</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Shelf-Life Decay Penalty in Decision</td>
                  <td className="p-3 text-rose-600">❌ None</td>
                  <td className="p-3 text-rose-600">❌ None</td>
                  <td className="p-3 bg-emerald-50 text-emerald-800 font-bold">✅ Perishability loss curves</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Tamil / Regional Voice Assistant</td>
                  <td className="p-3 text-rose-600">❌ Form heavy</td>
                  <td className="p-3 text-rose-600">❌ English only</td>
                  <td className="p-3 bg-emerald-50 text-emerald-800 font-bold">✅ Full Tamil/Hindi Speech</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
