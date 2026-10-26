import { NextResponse } from "next/server";
import { INITIAL_GUARDS } from "@/utils/mockStore";
import { analyzeGuardDeployment } from "@/utils/aiEngine";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body optional
    }

    const guardId = String(body?.guardId || body?.id || INITIAL_GUARDS[0].id);
    const targetGuard =
      INITIAL_GUARDS.find((g) => g.id === guardId || String(g.id) === String(guardId)) ||
      INITIAL_GUARDS[0];

    // Try external ML model if configured
    if (process.env.ML_PREDICT_URL) {
      try {
        const externalResponse = await fetch(process.env.ML_PREDICT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: targetGuard.id,
            totalExperienceYears: targetGuard.prevExperience?.reduce((acc, c) => acc + (c.experinceYears || 1), 0) || 3,
            averageRating: targetGuard.rating || 4.5,
            prevExperience: targetGuard.prevExperience,
          }),
        });
        if (externalResponse.ok) {
          const externalData = await externalResponse.json();
          return NextResponse.json(externalData, { status: 200 });
        }
      } catch {
        // Fallback to internal AI engine
      }
    }

    // Run local AI predictive engine
    const aiAnalysis = analyzeGuardDeployment(targetGuard);

    return NextResponse.json(
      {
        status: 200,
        prediction: aiAnalysis.optimalShift,
        recommendation: aiAnalysis.recommendedZone,
        reliabilityIndex: aiAnalysis.reliabilityIndex,
        fatigueRisk: aiAnalysis.fatigueRisk,
        deterrenceScore: aiAnalysis.incidentDeterrenceScore,
        geofenceCompliance: aiAnalysis.geofenceCompliance,
        aiSummary: aiAnalysis.aiSummary,
        insights: aiAnalysis.actionableInsights,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI Suggestions Error:", error);
    const fallback = analyzeGuardDeployment(INITIAL_GUARDS[0]);
    return NextResponse.json(
      {
        status: 200,
        prediction: fallback.optimalShift,
        recommendation: fallback.recommendedZone,
        aiSummary: fallback.aiSummary,
      },
      { status: 200 }
    );
  }
}
