import { CropInfo, MandiMarket, QualityGrade, NetRealizationResult, PreDispatchDecision } from '../types';

export function calculateNetRealization(
  crop: CropInfo,
  quantityKg: number,
  grade: QualityGrade,
  mandis: MandiMarket[]
): {
  results: NetRealizationResult[];
  decision: PreDispatchDecision;
} {
  // Quality Grade adjustment multiplier
  let gradeMultiplier = 1.0;
  if (grade.includes('Grade A')) gradeMultiplier = 1.08; // 8% premium for prime grade
  if (grade.includes('Grade C')) gradeMultiplier = 0.82; // 18% discount for processing/cull grade

  const quintals = quantityKg / 100;

  const results: NetRealizationResult[] = mandis.map((mandi) => {
    // Effective price per kg at this market adjusted for crop & grade
    const effectivePriceKg = (mandi.modalPriceKg * (crop.basePriceKg / 34)) * gradeMultiplier;
    const grossRevenue = effectivePriceKg * quantityKg;

    // Solo Transport freight calculation
    // Base hiring fee + ₹18-₹24/km depending on distance
    const soloTransport = Math.round(500 + mandi.distanceKm * 28 + (quantityKg > 1000 ? (quantityKg - 1000) * 0.4 : 0));
    
    // Shared Transport pool freight (35% to 45% savings by load consolidation)
    const sharedTransport = Math.round(soloTransport * 0.58);

    // Mandi commission / cess
    const mandiCommission = Math.round(grossRevenue * (mandi.commissionPercent / 100));

    // Loading, unloading & weighment
    const loadingUnloadingCost = Math.round(quintals * mandi.loadingCostPerQuintal);

    // Shelf-life perishability decay deduction
    // In transit + auction holding hours: quality drops, moisture loss occurs
    const transitDecayPercent = (mandi.transitHours / 24) * (crop.dailyDecayRatePercent / 100);
    const shelfLifeDecayDeduction = Math.round(grossRevenue * transitDecayPercent);

    // Toll and terminal gate fees
    const tollAndOtherCosts = mandi.tollAndGateCharges;

    // Total deductions
    const totalDeductionsSolo = soloTransport + mandiCommission + loadingUnloadingCost + shelfLifeDecayDeduction + tollAndOtherCosts;
    const totalDeductionsShared = sharedTransport + mandiCommission + loadingUnloadingCost + shelfLifeDecayDeduction + tollAndOtherCosts;

    const estimatedNetRealization = Math.max(0, Math.round(grossRevenue - totalDeductionsSolo));
    const estimatedNetRealizationShared = Math.max(0, Math.round(grossRevenue - totalDeductionsShared));

    const netPricePerKg = Number((estimatedNetRealization / quantityKg).toFixed(2));
    const netPricePerKgShared = Number((estimatedNetRealizationShared / quantityKg).toFixed(2));

    // Composite score considering net price, distance risk, and arrival status
    let score = netPricePerKg * 10;
    if (mandi.arrivalTrend === 'glut') score -= 15; // Risk of price drop during live auction
    if (mandi.arrivalTrend === 'shortage') score += 12; // Scarcity premium likely

    return {
      mandi,
      grossRevenue: Math.round(grossRevenue),
      transportCost: soloTransport,
      sharedTransportCost: sharedTransport,
      mandiCommission,
      loadingUnloadingCost,
      shelfLifeDecayDeduction,
      tollAndOtherCosts,
      estimatedNetRealization,
      estimatedNetRealizationShared,
      netPricePerKg,
      netPricePerKgShared,
      recommendationScore: score,
      isBestOption: false,
    };
  });

  // Sort by highest shared net realization
  results.sort((a, b) => b.estimatedNetRealizationShared - a.estimatedNetRealizationShared);

  // Mark the best option
  if (results.length > 0) {
    results[0].isBestOption = true;
  }

  const best = results[0];
  const local = results.find((r) => r.mandi.id === 'mandi-local') || results[results.length - 1];
  const netGainOverLocal = Math.max(0, best.estimatedNetRealizationShared - local.estimatedNetRealization);

  // Determine overall recommendation strategy
  let recommendation: PreDispatchDecision['recommendation'] = 'SELL_TODAY_REGIONAL_HUB';
  let headline = `SELL TODAY at ${best.mandi.name}`;
  let headlineTamil = `இன்றே விற்கவும்: ${best.mandi.nameLocal}`;
  let headlineHindi = `आज ही बेचें: ${best.mandi.name}`;
  let confidenceScore = 95;
  let shelfLifeWarning: string | undefined = undefined;

  if (crop.perishabilityRating === 'Extreme' || crop.perishabilityRating === 'High') {
    shelfLifeWarning = `High perishability: ${crop.name} decays at ${crop.dailyDecayRatePercent}%/day. Holding >48 hrs will wipe out potential price gains.`;
    headline = `SELL TODAY ➔ Dispatch to ${best.mandi.name} (Save ₹${best.transportCost - best.sharedTransportCost} with Shared Transport)`;
    headlineTamil = `இன்றே விற்கவும் ➔ ${best.mandi.nameLocal} (பகிர்வு வண்டியில் ₹${best.transportCost - best.sharedTransportCost} மிச்சமாகும்)`;
    headlineHindi = `आज ही बेचें ➔ ${best.mandi.name} (शेयर्ड वाहन से ₹${best.transportCost - best.sharedTransportCost} की बचत)`;
    recommendation = 'SELL_TODAY_REGIONAL_HUB';
  } else if (crop.coldStorageFeasible && crop.shelfLifeDays >= 30) {
    // Durable crop like Onion or Potato or Turmeric
    headline = `FAVORABLE PRICE WINDOW: ${best.mandi.name} offers peak net rate of ₹${best.netPricePerKgShared}/kg`;
    headlineTamil = `சாதகமான விலை: ${best.mandi.nameLocal} சந்தையில் ₹${best.netPricePerKgShared}/கிலோ நிகர லாபம்`;
    headlineHindi = `उत्तम बिक्री अवसर: ${best.mandi.name} में ₹${best.netPricePerKgShared}/किग्रा शुद्ध प्राप्ति`;
    recommendation = 'SELL_TODAY_REGIONAL_HUB';
  }

  const reasoning = `Dispatching ${quantityKg} kg of ${crop.name} (${grade}) to ${best.mandi.name} yields an estimated true net realization of ₹${best.estimatedNetRealizationShared.toLocaleString()} (₹${best.netPricePerKgShared}/kg). By pooling with nearby farmers in the active Shared Transport load, you save ₹${(best.transportCost - best.sharedTransportCost).toLocaleString()} in freight. Net gain over local farm-gate broker is +₹${netGainOverLocal.toLocaleString()}.`;

  const reasoningTamil = `${quantityKg} கிலோ ${crop.nameTamil} பயிரை ${best.mandi.nameLocal} சந்தைக்கு அனுப்புவது சிறந்த நிகர வருமானமான ₹${best.estimatedNetRealizationShared.toLocaleString()} தரும். சக விவசாயிகளுடன் பகிர்வு வாகனத்தில் செல்வதன் மூலம் போக்குவரத்து செலவில் ₹${(best.transportCost - best.sharedTransportCost).toLocaleString()} மிச்சமாகிறது. உள்ளூர் தரகரை விட +₹${netGainOverLocal.toLocaleString()} கூடுதல் லாபம்.`;

  const reasoningHindi = `${crop.nameHindi} (${quantityKg} किग्रा) को ${best.mandi.name} में भेजने पर वास्तविक शुद्ध प्राप्ति ₹${best.estimatedNetRealizationShared.toLocaleString()} (₹${best.netPricePerKgShared}/किग्रा) अनुमानित है। शेयर्ड लोडिंग से ₹${(best.transportCost - best.sharedTransportCost).toLocaleString()} परिवहन बचत होगी।`;

  const decision: PreDispatchDecision = {
    recommendation,
    headline,
    headlineTamil,
    headlineHindi,
    confidenceScore,
    reasoning,
    reasoningTamil,
    reasoningHindi,
    optimalMarketName: best.mandi.name,
    estimatedNetGainOverLocal: netGainOverLocal,
    shelfLifeWarning,
    marketComparisons: results,
  };

  return { results, decision };
}
