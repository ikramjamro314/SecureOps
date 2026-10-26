import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "../../../../../prisma/index";
import { INITIAL_GUARDS } from "@/utils/mockStore";

export async function GET() {
  if (isDbConfigured) {
    try {
      const guards = await prisma.user.findMany({
        where: { role: "GUARD" },
      });
      if (guards && guards.length > 0) {
        return NextResponse.json(guards);
      }
    } catch (error) {
      console.warn("DB query failed in /api/police/guard:", error);
    }
  }

  return NextResponse.json(INITIAL_GUARDS);
}
