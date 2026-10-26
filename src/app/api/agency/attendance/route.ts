import { prisma, isDbConfigured } from "../../../../../prisma/index";
import { NextRequest, NextResponse } from "next/server";
import { INITIAL_ATTENDANCE, INITIAL_GUARDS } from "@/utils/mockStore";

export async function GET() {
  if (isDbConfigured) {
    try {
      const dbRecords = await prisma.attendance.findMany({
        include: { user: true },
        orderBy: { id: "desc" },
      });

      if (dbRecords && dbRecords.length > 0) {
        const formatted = dbRecords.map((r: any) => ({
          id: r.id,
          date: r.checkIn?.split(" ")[0] || new Date().toISOString().split("T")[0],
          status: r.present ? "Present" : "Absent",
          shift: "Night",
          checkInTime: r.checkIn || "22:00",
          guardName: r.user?.name || "Guard",
          userId: r.userId,
        }));
        return NextResponse.json(formatted);
      }
    } catch (err) {
      console.warn("DB query error in /api/agency/attendance GET:", err);
    }
  }

  return NextResponse.json(INITIAL_ATTENDANCE);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const targetId = String(data?.id || "");

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(targetId);
    if (isDbConfigured && isValidObjectId) {
      try {
        const user = await prisma.user.findFirst({
          where: { id: targetId },
        });

        const attendance = await prisma.attendance.findMany({
          where: { userId: targetId },
        });

        if (user) {
          return NextResponse.json({ user, attendance: attendance || [] });
        }
      } catch (dbErr) {
        console.warn("DB query failed in POST /api/agency/attendance:", dbErr);
      }
    }

    // Match in mock data
    const matchedGuard =
      INITIAL_GUARDS.find((g) => g.id === targetId || String(g.id) === targetId) ||
      INITIAL_GUARDS[0];

    const matchedAttendance = INITIAL_ATTENDANCE.filter(
      (a) => a.userId === targetId || a.userId === matchedGuard.id
    );

    return NextResponse.json({
      user: matchedGuard,
      attendance: matchedAttendance.length > 0 ? matchedAttendance : INITIAL_ATTENDANCE,
    });
  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({
      user: INITIAL_GUARDS[0],
      attendance: INITIAL_ATTENDANCE,
    });
  }
}
