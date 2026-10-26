import { MockGuard } from "./mockStore";

export interface AISuggestionResult {
  guardId: string;
  guardName: string;
  reliabilityIndex: number; // 0 - 100
  fatigueRisk: "LOW" | "MODERATE" | "ELEVATED";
  geofenceCompliance: number; // percentage
  recommendedZone: string;
  optimalShift: string;
  incidentDeterrenceScore: number; // percentage
  aiSummary: string;
  actionableInsights: string[];
}

export const analyzeGuardDeployment = (guard: MockGuard): AISuggestionResult => {
  const yearsExp = guard.prevExperience?.reduce((acc, curr) => acc + (curr.experinceYears || 1), 0) || 2;
  const rating = guard.rating || 4.5;
  const isNightShift = guard.shift === "Night";
  const isOutOfZone = guard.location?.status === "outside";

  // Calculate composite Reliability Index
  let reliability = Math.round((rating / 5) * 60 + Math.min(yearsExp * 5, 30) + (guard.verified ? 10 : 0));
  reliability = Math.min(Math.max(reliability, 60), 99);

  // Fatigue assessment based on shift and ratings
  let fatigueRisk: "LOW" | "MODERATE" | "ELEVATED" = "LOW";
  if (isNightShift && yearsExp < 3) {
    fatigueRisk = "MODERATE";
  } else if (isOutOfZone) {
    fatigueRisk = "ELEVATED";
  }

  // Geofence compliance calculation
  const compliance = isOutOfZone ? 82 : Math.min(92 + Math.floor(rating * 1.5), 99);

  // AI recommendations
  const optimalShift =
    fatigueRisk === "ELEVATED"
      ? "Morning (06:00 - 14:00) with partner rotation"
      : isNightShift
      ? "Night (22:00 - 06:00) - High Vigilance"
      : "Evening (14:00 - 22:00) - Peak Traffic";

  const recommendedZone =
    rating >= 4.7
      ? "High-Traffic Commercial Plaza & Executive Tower"
      : guard.verified
      ? "Sector 4 Main Access Gate & ATM Corridor"
      : "Secondary Perimeter & Logistics Inspection Depot";

  const deterrenceScore = Math.min(Math.round(reliability * 0.92 + 5), 98);

  const actionableInsights = [
    `AI Patrol Optimization: Dispatch recommended around ${recommendedZone} during peak vulnerability hours.`,
    fatigueRisk === "ELEVATED"
      ? "Alert: Geofence variance detected. Recommend automated check-in prompt every 45 minutes."
      : "Sustained high compliance: Guard qualifies for senior patrol leader & emergency dispatch lead.",
    `Predicted incident deterrence rate: ${deterrenceScore}% within a 400m radius of deployment coordinates.`,
  ];

  const aiSummary = `${guard.name} exhibits a ${reliability}% Reliability Index with ${compliance}% historic geofence fidelity. AI recommends assignment to ${recommendedZone}.`;

  return {
    guardId: guard.id,
    guardName: guard.name,
    reliabilityIndex: reliability,
    fatigueRisk,
    geofenceCompliance: compliance,
    recommendedZone,
    optimalShift,
    incidentDeterrenceScore: deterrenceScore,
    aiSummary,
    actionableInsights,
  };
};

export const getHotspotAnalysis = () => {
  return [
    {
      zone: "SBI ATM Corridor (Sector 4)",
      riskLevel: "CRITICAL",
      incidentForecast: "+34% vulnerability between 01:00 AM - 04:00 AM",
      recommendedGuards: 2,
      activeGuards: 1,
    },
    {
      zone: "East Logistics Delivery Bay",
      riskLevel: "MODERATE",
      incidentForecast: "Parking & unauthorized access during shift changeovers",
      recommendedGuards: 2,
      activeGuards: 2,
    },
    {
      zone: "Central Mall & Residential Arcade",
      riskLevel: "LOW",
      incidentForecast: "Optimal surveillance coverage, minimal blindspots",
      recommendedGuards: 3,
      activeGuards: 3,
    },
  ];
};
