export type Language = 'en' | 'ta' | 'hi';

export type QualityGrade = 'Grade A (Premium/Firm)' | 'Grade B (Standard Market)' | 'Grade C (Processing/Cull)';

export interface CropInfo {
  id: string;
  name: string;
  nameTamil: string;
  nameHindi: string;
  category: 'Vegetable' | 'Fruit' | 'Cash Crop' | 'Grain' | 'Spice';
  shelfLifeDays: number;
  perishabilityRating: 'Extreme' | 'High' | 'Moderate' | 'Low';
  dailyDecayRatePercent: number;
  basePriceKg: number;
  unit: 'kg' | 'quintal';
  coldStorageFeasible: boolean;
  coldStorageCostPerDayPerQuintal: number;
  iconName: string;
}

export interface MandiMarket {
  id: string;
  name: string;
  nameLocal: string;
  district: string;
  state: string;
  distanceKm: number;
  transitHours: number;
  modalPriceKg: number;
  minPriceKg: number;
  maxPriceKg: number;
  todayArrivalsTons: number;
  normalAvgArrivalsTons: number;
  arrivalTrend: 'glut' | 'normal' | 'shortage';
  commissionPercent: number; // e.g. 1.5%
  loadingCostPerQuintal: number; // e.g. ₹15
  tollAndGateCharges: number;
  verifiedBuyersCount: number;
  eNamLinked: boolean;
}

export interface NetRealizationResult {
  mandi: MandiMarket;
  grossRevenue: number;
  transportCost: number;
  sharedTransportCost: number;
  mandiCommission: number;
  loadingUnloadingCost: number;
  shelfLifeDecayDeduction: number;
  tollAndOtherCosts: number;
  estimatedNetRealization: number;
  estimatedNetRealizationShared: number;
  netPricePerKg: number;
  netPricePerKgShared: number;
  recommendationScore: number;
  isBestOption: boolean;
}

export interface PreDispatchDecision {
  recommendation: 'SELL_TODAY_REGIONAL_HUB' | 'SELL_LOCAL_MANDI' | 'STORE_AND_WAIT' | 'SELL_DIRECT_BUYER';
  headline: string;
  headlineTamil: string;
  headlineHindi: string;
  confidenceScore: number; // e.g. 94
  reasoning: string;
  reasoningTamil: string;
  reasoningHindi: string;
  optimalMarketName: string;
  estimatedNetGainOverLocal: number;
  shelfLifeWarning?: string;
  marketComparisons: NetRealizationResult[];
}

export interface SharedTransportPool {
  id: string;
  route: string;
  vehicleType: string;
  totalCapacityKg: number;
  bookedCapacityKg: number;
  departureTime: string;
  driverName: string;
  driverPhone: string;
  originTaluk: string;
  destinationMandi: string;
  soloCostForLoad: number;
  sharedCostForLoad: number;
  savings: number;
  participants: {
    farmerName: string;
    crop: string;
    quantityKg: number;
    pickupPoint: string;
  }[];
}

export interface VerifiedBuyer {
  id: string;
  name: string;
  companyType: 'Retail Chain' | 'FPO Aggregator' | 'Food Processor' | 'Export House' | 'Mandi Commission Agent';
  location: string;
  trustScore: number; // out of 100
  paymentTurnaround: 'Instant UPI/NEFT' | 'T+1 Day Guaranteed' | 'T+2 Days' | 'T+3 Days';
  verifiedCredentials: {
    gstVerified: boolean;
    fssaiVerified: boolean;
    apmcLicensed: boolean;
    totalTradesCompleted: number;
  };
  demandCrops: {
    cropId: string;
    offeredPriceKg: number;
    minQuantityKg: number;
    maxQuantityKg: number;
    qualityRequirement: string;
  }[];
}

export interface PredictionActualFeedback {
  id: string;
  date: string;
  farmerName: string;
  crop: string;
  quantityKg: number;
  mandiName: string;
  predictedPriceKg: number;
  actualPriceKg: number;
  predictedTransportCost: number;
  actualTransportCost: number;
  predictedNetRealization: number;
  actualNetRealization: number;
  variancePercent: number; // e.g. +1.8% or -2.4%
  accuracyScore: number; // e.g. 98.2%
  calibratedParameter: string;
  notes: string;
}

export interface CompetitorPlatform {
  name: string;
  tagline: string;
  officialUrl: string;
  searchUrl: string;
  type: 'Govt. Platform' | 'Commercial Portal' | 'Agri-Tech Startup';
  capabilities: string[];
  limitations: string[];
  farmFlowAdvantage: string;
}

export type UserRole = 'farmer' | 'buyer_warehouse' | 'transport_owner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  verified: boolean;
  // Role specific fields
  farmDetails?: {
    landAcres: number;
    primaryCrops: string[];
    pmKisanId?: string;
    fpoMember: boolean;
  };
  buyerWarehouseDetails?: {
    entityType: 'Institutional Buyer' | 'Wholesale Trader' | 'Cold Storage Warehouse' | 'Food Processor';
    gstin: string;
    warehouseCapacityMT?: number;
    coldStorageTempZones?: string;
    apmcLicenseNo: string;
  };
  transportDetails?: {
    companyName: string;
    fleetSize: number;
    vehicleTypes: string[];
    permitType: 'All India Permit' | 'State Agricultural Permit';
    serviceTaluks: string[];
  };
  adminDetails?: {
    department: 'Market Operations' | 'Price Intelligence' | 'Platform Security';
    accessLevel: 'Super Admin' | 'Market Auditor';
  };
}

export interface ForecastDataPoint {
  dayLabel: string;
  date: string;
  predictedPrice: number;
  confidenceLower80: number;
  confidenceUpper80: number;
  confidenceLower95: number;
  confidenceUpper95: number;
  estimatedArrivalTons: number;
  demandIndex: number; // 0 to 100
  marketSentiment: 'Bullish' | 'Neutral' | 'Bearish';
  keySignal: string;
}

export interface CropForecastSummary {
  cropId: string;
  cropName: string;
  currentModalPrice: number;
  forecastHorizonDays: number;
  predictedTrend: 'Strong Upward' | 'Moderate Upward' | 'Stable' | 'Moderate Downward' | 'Sharp Correction';
  confidenceScore: number; // e.g. 88%
  volatilityIndex: 'Low' | 'Moderate' | 'High' | 'Extreme';
  forecastSeries: ForecastDataPoint[];
  historicalSeries: { date: string; dayLabel: string; actualPrice: number; arrivalsTons: number }[];
  drivingFactors: {
    factor: string;
    impact: 'Positive (+)' | 'Negative (-)' | 'Neutral';
    description: string;
  }[];
  recommendation: string;
  recommendationTamil: string;
}

