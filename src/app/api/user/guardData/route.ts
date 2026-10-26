import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "../../../../../prisma/index";
import { INITIAL_AGENCIES } from "@/utils/mockStore";

export async function GET() {
  if (isDbConfigured) {
    try {
      const agenciesWithUsers = await prisma.agency.findMany({
        include: {
          users: true,
        },
      });

      if (agenciesWithUsers && agenciesWithUsers.length > 0) {
        return NextResponse.json(agenciesWithUsers);
      }
    } catch (error) {
      console.warn("DB query failed in /api/user/guardData:", error);
    }
  }

  return NextResponse.json(INITIAL_AGENCIES);
}
