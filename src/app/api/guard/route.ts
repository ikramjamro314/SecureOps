import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "../../../../prisma/index";
import { INITIAL_GUARDS } from "@/utils/mockStore";

export async function GET() {
  if (isDbConfigured) {
    try {
      const dbGuards = await prisma.user.findMany({
        where: {
          role: "GUARD",
        },
      });

      if (dbGuards && dbGuards.length > 0) {
        return NextResponse.json({
          response: dbGuards,
        });
      }
    } catch (error) {
      console.warn("DB query error in /api/guard:", error);
    }
  }

  return NextResponse.json({
    response: INITIAL_GUARDS,
  });
}
