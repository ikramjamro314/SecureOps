import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "../../../../prisma/index";
import { INITIAL_GUARDS } from "@/utils/mockStore";

export async function GET() {
  if (isDbConfigured) {
    try {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;

      if (email) {
        const agency = await prisma.agency.findFirst({
          where: { email },
          include: { users: true },
        });

        if (agency?.users && agency.users.length > 0) {
          return NextResponse.json(agency.users);
        }
      }

      // Try finding all users with GUARD role
      const dbGuards = await prisma.user.findMany({
        where: { role: "GUARD" },
      });

      if (dbGuards && dbGuards.length > 0) {
        return NextResponse.json(dbGuards);
      }
    } catch (error) {
      console.warn("DB query failed in /api/agency, using fallback guards:", error);
    }
  }

  // Fallback to rich initial mock guards
  return NextResponse.json(INITIAL_GUARDS);
}
