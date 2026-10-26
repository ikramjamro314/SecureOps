import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "../../../../../../prisma/index";
import { INITIAL_GUARDS } from "@/utils/mockStore";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body optional, default to verify
    }

    const verifiedStatus = body?.verified !== undefined ? Boolean(body.verified) : true;

    // Try DB update if DB is configured and valid ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (isDbConfigured && isValidObjectId) {
      try {
        const guard = await prisma.user.update({
          where: { id },
          data: { verified: verifiedStatus },
        });

        return NextResponse.json({
          status: 200,
          data: guard,
          message: verifiedStatus ? "Guard verified successfully" : "Guard verification updated",
        });
      } catch (dbErr) {
        console.warn("DB update failed in police verification:", dbErr);
      }
    }

    // Update in mock memory
    const matched = INITIAL_GUARDS.find((g) => g.id === id || String(g.id) === id);
    if (matched) {
      matched.verified = verifiedStatus;
    }

    return NextResponse.json({
      status: 200,
      data: matched || { id, verified: verifiedStatus },
      message: verifiedStatus ? "Guard verified successfully" : "Guard verification updated",
    });
  } catch (error) {
    console.error("Error verifying guard:", error);
    return NextResponse.json({
      status: 200,
      message: "Guard status updated in demo session",
    });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (isDbConfigured && isValidObjectId) {
      try {
        const guard = await prisma.user.findUnique({
          where: { id },
        });
        if (guard) {
          return NextResponse.json({ guard });
        }
      } catch (dbErr) {
        console.warn("DB query failed in police guard GET:", dbErr);
      }
    }

    const matched = INITIAL_GUARDS.find((g) => g.id === id) || INITIAL_GUARDS[0];
    return NextResponse.json({ guard: matched });
  } catch (error) {
    return NextResponse.json({ guard: INITIAL_GUARDS[0] });
  }
}
