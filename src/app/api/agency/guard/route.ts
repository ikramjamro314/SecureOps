import { NextResponse, NextRequest } from "next/server";
import { prisma, isDbConfigured } from "../../../../../prisma/index";
import { INITIAL_GUARDS } from "@/utils/mockStore";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const targetId = String(data?.id || "");

    // Try finding in DB if DB is configured and valid ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(targetId);
    if (isDbConfigured && isValidObjectId) {
      try {
        const guardData = await prisma.user.findUnique({
          where: { id: targetId },
          include: { ratingsReceived: true, prevExperience: true },
        });

        if (guardData) {
          return NextResponse.json(guardData);
        }
      } catch (dbErr) {
        console.warn("DB query failed in /api/agency/guard:", dbErr);
      }
    }

    // Match in INITIAL_GUARDS by id or fallback to first guard
    const fallbackGuard =
      INITIAL_GUARDS.find(
        (g) => g.id === targetId || String(g.id) === targetId || targetId.includes(g.id)
      ) || INITIAL_GUARDS[0];

    return NextResponse.json(fallbackGuard);
  } catch (error) {
    console.error("Error in /api/agency/guard:", error);
    return NextResponse.json(INITIAL_GUARDS[0]);
  }
}
