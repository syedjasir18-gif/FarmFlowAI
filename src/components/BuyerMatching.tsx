import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Printer,
  BadgeCheck
} from 'lucide-react';
import { VerifiedBuyer, Language } from '../types';
import { VERIFIED_BUYERS } from '../data/agriData';

interface BuyerMatchingProps {
  language: Language;
  currentCropId?: string;
  currentQuantityKg?: number;
}

export const BuyerMatching: React.FC<BuyerMatchingProps> = ({
  language,
  currentCropId = 'tomato',
  currentQuantityKg = 500,
}) => {
  const [buyers] = useState<VerifiedBuyer[]>(VERIFIED_BUYERS);
  const [selectedBuyer, setSelectedBuyer] = useState<VerifiedBuyer | null>(null);
  const [createdOfferSlip, setCreatedOfferSlip] = useState<any | null>(null);

  const handleGenerateDigitalOffer = (buyer: VerifiedBuyer) => {
    setSelectedBuyer(buyer);
    const demand = buyer.demandCrops.find((d) => d.cropId === currentCropId) || buyer.demandCrops[0];
    const totalGross = demand.offeredPriceKg * currentQuantityKg;
    const netPayable = Math.round(totalGross * 0.985); // minus nominal 1.5% assaying & platform fee

    setCreatedOfferSlip({
      lotId: `FF-LOT-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      buyerName: buyer.name,
      buyerType: buyer.companyType,
      farmerName: 'Farmer Member #742',
      crop: 'Tomato (Fresh Harvest)',
      quantityKg: currentQuantityKg,
      ratePerKg: demand.offeredPriceKg,
      totalGross,
      netPayable,
      paymentTerms: buyer.paymentTurnaround,
      escrowGuarantee: 'T+1 Bank Transfer via FarmFlow Escrow Node',
      pickupLocation: buyer.location,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Feature Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> INSTITUTIONAL DIRECT ESCROW
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Verified Buyer Trust & Direct Procurement
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
              {language === 'ta' 
                ? 'சரிபார்க்கப்பட்ட நேரடி வாங்குவோர் (Verified Buyer Matching)'
                : 'Direct Verified Buyers & Trust Escrow'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              {language === 'ta'
                ? 'தரகர்கள் ஏமாற்றாமல், APMC உரிமம் மற்றும் GST உள்ள நம்பகமான நிறுவன வாங்குவோருடன் விவசாயிகளை இணைத்து, T+1 நாளில் நேரடி வங்கி பணம் செலுத்துவதை உறுதி செய்கிறது.'
                : 'Connects farmers and FPOs directly to vetted retail hubs and food processors with audited payment turnaround ratings (T+1 settlement guarantees).'}
            </p>
          </div>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buyers.map((buyer) => {
          const matchingDemand = buyer.demandCrops.find((d) => d.cropId === currentCropId);
          return (
            <div
              key={buyer.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:border-stone-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm sm:text-base text-stone-900">
                      {buyer.name}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {buyer.companyType} • {buyer.location}
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span>{buyer.trustScore}% Trust</span>
                  </div>
                </div>
              </div>

              {/* Demand & Pricing */}
              {matchingDemand ? (
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-900 font-semibold">Active Demand for Tomato:</span>
                    <span className="text-sm font-extrabold text-emerald-800 font-mono">
                      ₹{matchingDemand.offeredPriceKg.toFixed(1)}/kg
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800/80">
                    Quality Spec: {matchingDemand.qualityRequirement}
                  </div>
                  <div className="text-[10px] text-stone-500 pt-1">
                    Accepts lot sizes: {matchingDemand.minQuantityKg} kg – {matchingDemand.maxQuantityKg} kg
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-600">
                  Accepts bulk lots for multiple seasonal horticulture crops.
                </div>
              )}

              {/* Trust credentials badges */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  GST & APMC Verified
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  <Clock className="w-3 h-3 mr-1 text-blue-600" />
                  {buyer.paymentTurnaround}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {buyer.verifiedCredentials.totalTradesCompleted} Trades Closed
                </span>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                <span className="text-xs text-stone-500">Zero commission deduction</span>
                <button
                  id={`btn-match-buyer-${buyer.id}`}
                  onClick={() => handleGenerateDigitalOffer(buyer)}
                  className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Create Digital Offer</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Generated Digital Offer Modal / Pass */}
      {createdOfferSlip && (
        <div className="bg-white rounded-2xl p-5 border-2 border-emerald-500/50 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                Official Digital Dispatch Slip
              </span>
              <h4 className="text-base font-bold text-stone-900 mt-1">
                FarmFlow Lot Agreement: {createdOfferSlip.lotId}
              </h4>
            </div>
            <button
              onClick={() => setCreatedOfferSlip(null)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-2 py-1 rounded"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-100">
            <div>
              <div className="text-stone-500">Buyer:</div>
              <div className="font-bold text-stone-900">{createdOfferSlip.buyerName}</div>
            </div>
            <div>
              <div className="text-stone-500">Agreed Rate:</div>
              <div className="font-bold text-stone-900 font-mono">₹{createdOfferSlip.ratePerKg}/kg</div>
            </div>
            <div>
              <div className="text-stone-500">Total Lot Weight:</div>
              <div className="font-bold text-stone-900 font-mono">{createdOfferSlip.quantityKg} kg</div>
            </div>
            <div>
              <div className="text-stone-500">Net Farmer Payout:</div>
              <div className="font-extrabold text-emerald-700 font-mono text-sm">
                ₹{createdOfferSlip.netPayable.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-xs text-stone-600 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Escrow Status: Funds pre-authorized in T+1 settlement gateway.</span>
            </div>
            <div className="text-stone-500 text-[11px]">
              Dispatch Gate Slip generated on {createdOfferSlip.timestamp}. Present this QR/Pass at buyer loading bay.
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>Print / Save Lot Pass</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
