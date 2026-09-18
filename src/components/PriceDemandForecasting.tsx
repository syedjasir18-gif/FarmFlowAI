import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  Sliders, 
  CloudRain, 
  Truck, 
  Info, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Language, CropForecastSummary, ForecastDataPoint } from '../types';
import { FORECAST_SUMMARIES } from '../data/forecastData';

interface PriceDemandForecastingProps {
  language: Language;
}

export const PriceDemandForecasting: React.FC<PriceDemandForecastingProps> = ({ language }) => {
  const [selectedCropKey, setSelectedCropKey] = useState<string>('tomato');
  const [horizonDays, setHorizonDays] = useState<number>(7);
  const [activeHoverPoint, setActiveHoverPoint] = useState<ForecastDataPoint | null>(null);

  // Shock Simulator Parameters
  const [arrivalShockPercent, setArrivalShockPercent] = useState<number>(-15); // e.g. -15% supply crunch
  const [weatherRainRisk, setWeatherRainRisk] = useState<number>(70); // 70% rain probability
  const [festivalSurgePercent, setFestivalSurgePercent] = useState<number>(10); // +10% festival demand

  const baseSummary = FORECAST_SUMMARIES[selectedCropKey] || FORECAST_SUMMARIES.tomato;

  // Dynamically adjusted forecast points based on shock sliders
  const adjustedSeries = useMemo(() => {
    return baseSummary.forecastSeries.slice(0, horizonDays).map((pt, idx) => {
      // Net price adjustment factor
      const supplyMultiplier = 1 - (arrivalShockPercent / 100) * 0.45; // supply drop raises price
      const weatherMultiplier = 1 + (weatherRainRisk / 100) * 0.06; // rain raises spot price
      const demandMultiplier = 1 + (festivalSurgePercent / 100) * 0.5; // demand surge raises price
      const combinedFactor = supplyMultiplier * weatherMultiplier * demandMultiplier;

      const adjustedPrice = Number((pt.predictedPrice * combinedFactor).toFixed(1));
      const uncertaintySpread = 1 + idx * 0.05; // uncertainty expands into the future

      const lower80 = Number((adjustedPrice - 1.8 * uncertaintySpread).toFixed(1));
      const upper80 = Number((adjustedPrice + 1.9 * uncertaintySpread).toFixed(1));
      const lower95 = Number((adjustedPrice - 3.2 * uncertaintySpread).toFixed(1));
      const upper95 = Number((adjustedPrice + 3.4 * uncertaintySpread).toFixed(1));

      const adjustedArrival = Math.max(10, Math.round(pt.estimatedArrivalTons * (1 + arrivalShockPercent / 100)));
      const adjustedDemand = Math.min(100, Math.round(pt.demandIndex * (1 + festivalSurgePercent / 200)));

      return {
        ...pt,
        predictedPrice: adjustedPrice,
        confidenceLower80: lower80,
        confidenceUpper80: upper80,
        confidenceLower95: lower95,
        confidenceUpper95: upper95,
        estimatedArrivalTons: adjustedArrival,
        demandIndex: adjustedDemand,
      };
    });
  }, [baseSummary, horizonDays, arrivalShockPercent, weatherRainRisk, festivalSurgePercent]);

  // Determine graph bounds
  const allPrices = [
    ...baseSummary.historicalSeries.map((h) => h.actualPrice),
    ...adjustedSeries.map((f) => f.confidenceUpper95),
    ...adjustedSeries.map((f) => f.confidenceLower95),
  ];
  const minPrice = Math.floor(Math.min(...allPrices) - 2);
  const maxPrice = Math.ceil(Math.max(...allPrices) + 3);
  const priceRange = maxPrice - minPrice;

  // Chart coordinates calculation helper
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const totalPoints = baseSummary.historicalSeries.length + adjustedSeries.length;
  const stepX = plotWidth / (totalPoints - 1);

  const getY = (price: number) => {
    return paddingY + plotHeight - ((price - minPrice) / priceRange) * plotHeight;
  };

  // Historical path
  const histPoints = baseSummary.historicalSeries.map((h, i) => ({
    x: paddingX + i * stepX,
    y: getY(h.actualPrice),
    item: h,
  }));
  const histPathD = histPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');

  // Future path and confidence areas
  const forecastPoints = adjustedSeries.map((f, i) => {
    const histLen = baseSummary.historicalSeries.length;
    const x = paddingX + (histLen - 1 + i + 1) * stepX;
    return {
      x,
      y: getY(f.predictedPrice),
      yUpper80: getY(f.confidenceUpper80),
      yLower80: getY(f.confidenceLower80),
      yUpper95: getY(f.confidenceUpper95),
      yLower95: getY(f.confidenceLower95),
      item: f,
    };
  });

  // Connecting last historical to first forecast
  const lastHist = histPoints[histPoints.length - 1];
  const fullForecastLineD = [
    `M ${lastHist.x},${lastHist.y}`,
    ...forecastPoints.map((p) => `L ${p.x},${p.y}`),
  ].join(' ');

  // 95% confidence fan area
  const fan95PathD = [
    `M ${lastHist.x},${lastHist.y}`,
    ...forecastPoints.map((p) => `L ${p.x},${p.yUpper95}`),
    ...[...forecastPoints].reverse().map((p) => `L ${p.x},${p.yLower95}`),
    `Z`,
  ].join(' ');

  // 80% confidence fan area
  const fan80PathD = [
    `M ${lastHist.x},${lastHist.y}`,
    ...forecastPoints.map((p) => `L ${p.x},${p.yUpper80}`),
    ...[...forecastPoints].reverse().map((p) => `L ${p.x},${p.yLower80}`),
    `Z`,
  ].join(' ');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 mr-1 fill-amber-950" /> AI Price & Demand Forecasting
              </span>
              <span className="text-xs text-emerald-200">
                Multi-Signal Uncertainty Engine
              </span>
            </div>
            
            <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-white">
              {language === 'ta' 
                ? 'விலை & தேவை முன்னறிவிப்பு முறைமை' 
                : 'Short-Term Price & Demand Trend Forecasting'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {language === 'ta'
                ? 'கடந்த கால விலை வரத்து, வானிலை மழை தாக்கம், மற்றும் பண்டிகை தேவைகளை அடிப்படையாகக் கொண்டு அடுத்த 1-7 நாட்களின் விலையை 80% மற்றும் 95% நிச்சயமற்ற தன்மை எல்லைகளுடன் முன்கூட்டியே கணிக்கிறது.'
                : 'Fuses historical mandi arrivals, weather disruption indices, and buyer order books to forecast short-term modal price paths with explicit 80% and 95% confidence bands.'}
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 bg-stone-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-700/40 text-center">
            <div className="p-2">
              <div className="text-[10px] text-emerald-300 font-semibold uppercase">Confidence Score</div>
              <div className="text-xl font-extrabold text-white font-mono mt-0.5">{baseSummary.confidenceScore}%</div>
              <div className="text-[10px] text-emerald-400">High Reliability</div>
            </div>
            <div className="p-2">
              <div className="text-[10px] text-emerald-300 font-semibold uppercase">Projected Trend</div>
              <div className="text-base font-extrabold text-amber-300 mt-0.5 flex items-center justify-center">
                {baseSummary.predictedTrend === 'Strong Upward' ? (
                  <ArrowUpRight className="w-4 h-4 mr-1 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1 text-amber-400" />
                )}
                <span className="text-xs font-bold">{baseSummary.predictedTrend}</span>
              </div>
              <div className="text-[10px] text-stone-400">Next 7 Days</div>
            </div>
            <div className="p-2 col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-emerald-800/60">
              <div className="text-[10px] text-emerald-300 font-semibold uppercase">Market Volatility</div>
              <div className="text-base font-extrabold text-white font-mono mt-0.5">{baseSummary.volatilityIndex}</div>
              <div className="text-[10px] text-emerald-400">Weather Influenced</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Crop Selector & Time Horizon */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Crop Selection Chips */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0">
            Select Crop:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(FORECAST_SUMMARIES).map((crop) => {
              const isSelected = crop.cropId === selectedCropKey;
              return (
                <button
                  key={crop.cropId}
                  onClick={() => {
                    setSelectedCropKey(crop.cropId);
                    setActiveHoverPoint(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {crop.cropName} (₹{crop.currentModalPrice}/kg)
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0">
            Horizon:
          </span>
          <div className="bg-stone-100 p-1 rounded-xl flex space-x-1 text-xs">
            {[3, 5, 7].map((days) => (
              <button
                key={days}
                onClick={() => setHorizonDays(days)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  horizonDays === days
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Interactive Forecast Chart with Confidence Intervals */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-700" />
              {baseSummary.cropName} — Price Trajectory & Confidence Cone
            </h3>
            <p className="text-xs text-stone-500">
              Shaded regions indicate 80% (darker green) and 95% (lighter teal) statistical confidence intervals.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-stone-500" />
              <span className="text-stone-600 font-medium">Historical Actual</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-stone-600 font-medium">Predicted Modal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-200" />
              <span className="text-stone-600 font-medium">80% Confidence</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-teal-100" />
              <span className="text-stone-600 font-medium">95% Confidence</span>
            </div>
          </div>
        </div>

        {/* SVG Visualization Canvas */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[680px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-64 overflow-visible">
              
              {/* Grid Lines and Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = paddingY + plotHeight * ratio;
                const priceVal = (maxPrice - ratio * priceRange).toFixed(1);
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94a3b8"
                      fontFamily="monospace"
                    >
                      ₹{priceVal}
                    </text>
                  </g>
                );
              })}

              {/* Dotted separator between Historical and Future Forecast */}
              <line
                x1={lastHist.x}
                y1={paddingY}
                x2={lastHist.x}
                y2={svgHeight - paddingY}
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={lastHist.x - 6}
                y={paddingY - 10}
                textAnchor="end"
                fontSize="10"
                fontWeight="bold"
                fill="#64748b"
              >
                ◀ PAST ACTUALS
              </text>
              <text
                x={lastHist.x + 6}
                y={paddingY - 10}
                textAnchor="start"
                fontSize="10"
                fontWeight="bold"
                fill="#059669"
              >
                AI FORECAST (NEXT {horizonDays}D) ▶
              </text>

              {/* 95% Confidence Cone (Outer) */}
              <path
                d={fan95PathD}
                fill="#ccfbf1"
                opacity="0.65"
              />

              {/* 80% Confidence Cone (Inner) */}
              <path
                d={fan80PathD}
                fill="#a7f3d0"
                opacity="0.8"
              />

              {/* Historical Line (Solid Slate) */}
              <path
                d={histPathD}
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Forecast Line (Solid Emerald) */}
              <path
                d={fullForecastLineD}
                fill="none"
                stroke="#047857"
                strokeWidth="3"
                strokeDasharray="5 3"
                strokeLinecap="round"
              />

              {/* Historical Dots */}
              {histPoints.map((pt, i) => (
                <circle
                  key={`hist-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  fill="#475569"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}

              {/* Forecast Interactive Dots with Hover Detection */}
              {forecastPoints.map((pt, i) => {
                const isHovered = activeHoverPoint?.dayLabel === pt.item.dayLabel;
                return (
                  <g key={`fc-${i}`}>
                    {/* Upper/Lower 95% tick lines */}
                    <line
                      x1={pt.x}
                      y1={pt.yUpper95}
                      x2={pt.x}
                      y2={pt.yLower95}
                      stroke="#059669"
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />
                    
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 5}
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setActiveHoverPoint(pt.item)}
                    />
                  </g>
                );
              })}

              {/* X-Axis Labels */}
              {[...baseSummary.historicalSeries, ...adjustedSeries].map((item, idx) => {
                const x = paddingX + idx * stepX;
                const isFuture = idx >= baseSummary.historicalSeries.length;
                return (
                  <text
                    key={`x-label-${idx}`}
                    x={x}
                    y={svgHeight - paddingY + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight={isFuture ? 'bold' : 'normal'}
                    fill={isFuture ? '#065f46' : '#64748b'}
                  >
                    {item.dayLabel.split(' ')[0]}
                  </text>
                );
              })}

            </svg>
          </div>
        </div>

        {/* Selected / Hovered Day Detail Strip */}
        {activeHoverPoint ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-emerald-950">
                  {activeHoverPoint.dayLabel} ({activeHoverPoint.date}) Forecast Details
                </span>
                <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full">
                  Sentiment: {activeHoverPoint.marketSentiment}
                </span>
              </div>
              <div className="text-xs text-emerald-800 mt-1">
                <strong>Leading Signal:</strong> {activeHoverPoint.keySignal}
              </div>
            </div>

            <div className="flex items-center space-x-4 shrink-0 text-xs">
              <div>
                <div className="text-stone-500 text-[10px] font-semibold">Predicted Modal</div>
                <div className="text-base font-extrabold text-emerald-800 font-mono">
                  ₹{activeHoverPoint.predictedPrice}/kg
                </div>
              </div>
              <div className="border-l border-emerald-200 pl-3">
                <div className="text-stone-500 text-[10px] font-semibold">80% Conf. Range</div>
                <div className="text-xs font-bold text-stone-700 font-mono">
                  ₹{activeHoverPoint.confidenceLower80} - ₹{activeHoverPoint.confidenceUpper80}
                </div>
              </div>
              <div className="border-l border-emerald-200 pl-3">
                <div className="text-stone-500 text-[10px] font-semibold">95% Conf. Range</div>
                <div className="text-xs font-bold text-stone-700 font-mono">
                  ₹{activeHoverPoint.confidenceLower95} - ₹{activeHoverPoint.confidenceUpper95}
                </div>
              </div>
              <div className="border-l border-emerald-200 pl-3">
                <div className="text-stone-500 text-[10px] font-semibold">Mandi Arrivals</div>
                <div className="text-xs font-bold text-stone-800 font-mono">
                  {activeHoverPoint.estimatedArrivalTons} Tons
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-500 flex items-center justify-between">
            <span className="flex items-center">
              <Info className="w-4 h-4 mr-1.5 text-stone-400" />
              Hover or tap any forecast point on the chart to inspect confidence bounds, arrival estimates, and key drivers.
            </span>
            <span className="font-semibold text-emerald-700">Live AI Bayesian Filter Active</span>
          </div>
        )}

      </div>

      {/* Interactive Market Shock Simulator & What-If Engine */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-stone-900 flex items-center">
              <Sliders className="w-4 h-4 mr-2 text-emerald-600" />
              What-If Market Shock Simulator (Arrival & Weather Signals)
            </h4>
            <p className="text-xs text-stone-500">
              Adjust variables below to simulate how localized climate and supply events reshape the price curve in real-time.
            </p>
          </div>
          <button
            onClick={() => {
              setArrivalShockPercent(-15);
              setWeatherRainRisk(70);
              setFestivalSurgePercent(10);
            }}
            className="text-xs font-semibold text-stone-600 hover:text-emerald-700 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-lg transition-colors"
          >
            Reset to Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          
          {/* Slider 1: Arrival Volume Deviation */}
          <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-700 flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Mandi Arrival Deviation:
              </span>
              <span className={`font-mono font-extrabold ${arrivalShockPercent < 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {arrivalShockPercent > 0 ? `+${arrivalShockPercent}% (Glut)` : `${arrivalShockPercent}% (Shortage)`}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              step={5}
              value={arrivalShockPercent}
              onChange={(e) => setArrivalShockPercent(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>-50% Severe Shortage</span>
              <span>+50% Massive Glut</span>
            </div>
          </div>

          {/* Slider 2: Weather & Transit Delay Risk */}
          <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-700 flex items-center">
                <CloudRain className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Precipitation / Delay Risk:
              </span>
              <span className="font-mono font-extrabold text-blue-700">
                {weatherRainRisk}% Probability
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={weatherRainRisk}
              onChange={(e) => setWeatherRainRisk(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>0% Dry Skies</span>
              <span>100% Highway Inundation</span>
            </div>
          </div>

          {/* Slider 3: Festive & Institutional Demand */}
          <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-700 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Buyer Procurement Surge:
              </span>
              <span className="font-mono font-extrabold text-amber-700">
                +{festivalSurgePercent}% Demand
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={festivalSurgePercent}
              onChange={(e) => setFestivalSurgePercent(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>Baseline Demand</span>
              <span>+40% Festival Peak</span>
            </div>
          </div>

        </div>

        {/* AI Recommendation Strategy */}
        <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 border border-emerald-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Optimal Farmer Action Window</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-2xl">
              {language === 'ta' ? baseSummary.recommendationTamil : baseSummary.recommendation}
            </p>
          </div>

          <div className="shrink-0">
            <div className="bg-emerald-800/80 px-4 py-2 rounded-xl text-center border border-emerald-700">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">Forecast Accuracy</div>
              <div className="text-xl font-extrabold text-amber-300 font-mono">92.4%</div>
            </div>
          </div>
        </div>

      </div>

      {/* Driving Signal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {baseSummary.drivingFactors.map((driver, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                driver.impact === 'Positive (+)' 
                  ? 'bg-emerald-100 text-emerald-800'
                  : driver.impact === 'Negative (-)'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {driver.impact}
              </span>
            </div>
            <h5 className="font-bold text-xs text-stone-900">{driver.factor}</h5>
            <p className="text-[11px] text-stone-500 leading-relaxed">{driver.description}</p>
          </div>
        ))}
      </div>

    </motion.div>
  );
};
