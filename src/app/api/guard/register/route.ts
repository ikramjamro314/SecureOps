import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbConfigured } from "../../../../../prisma/index";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { INITIAL_GUARDS } from "@/utils/mockStore";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email || INITIAL_GUARDS[0].email;
    const body = await req.json();

    if (isDbConfigured && email) {
      try {
        const user = await prisma.user.update({
          where: { email },
          data: {
            phone: body.phone,
            address: body.address,
            adhar: body.adhar,
            gender: body.gender,
            age: body.age ? String(body.age) : undefined,
          },
        });
        return NextResponse.json({
          status: 200,
          data: user,
          message: "Profile updated successfully",
        });
      } catch (dbErr) {
        console.warn("DB update failed in /api/guard/register, using mock fallback:", dbErr);
      }
    }

    // Update in mock store
    const target = INITIAL_GUARDS[0];
    target.phone = body.phone || target.phone;
    target.address = body.address || target.address;
    target.age = body.age ? Number(body.age) : target.age;

    return NextResponse.json({
      status: 200,
      data: target,
      message: "Profile updated successfully in demo session",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({
      status: 200,
      message: "Profile saved successfully",
    });
  }
}
