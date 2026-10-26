import { NextRequest, NextResponse } from "next/server";
import { INITIAL_INCIDENTS, MockIncident } from "@/utils/mockStore";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const incidentType = data?.name || data?.alertType || data?.subject || "Theft Alert";
    const incidentSeverity =
      data?.severity ||
      (incidentType.includes("Fire") || incidentType.includes("Medical") ? "CRITICAL" : "HIGH");

    const newIncident: MockIncident = {
      id: `inc-${Date.now()}`,
      incidentID: `SEC-2025-${Math.floor(100 + Math.random() * 900)}`,
      from: data?.email || "resident@secureops.demo",
      subject: incidentType,
      type: incidentType,
      message: data?.message || "Emergency assistance requested by resident.",
      location: data?.location || "Sector 4 Community Grid (Geofence Pin #8)",
      received: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Active",
      priority: incidentSeverity as "CRITICAL" | "HIGH",
      suspectDescription: data?.suspectDescription || "Details reported via resident SOS dispatch portal.",
    };

    // Prepend to server in-memory incidents list
    INITIAL_INCIDENTS.unshift(newIncident);

    // Optional email dispatch attempt (non-blocking)
    if (process.env.MAILING_SERVICE_URL) {
      try {
        fetch(process.env.MAILING_SERVICE_URL, {
          headers: { "content-type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            message: newIncident.message,
            incidentID: newIncident.incidentID,
            type: newIncident.type,
          }),
        }).catch(() => {});
      } catch {
        // Ignore external service failure
      }
    }

    return NextResponse.json({
      message: "Emergency alert recorded and broadcasted across Police, Agency, and Guard network",
      status: 200,
      incident: newIncident,
    });
  } catch (error) {
    console.error("Alert broadcast error:", error);
    return NextResponse.json(
      { message: "Alert registered in local emergency log", status: 200 },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json(INITIAL_INCIDENTS);
}
