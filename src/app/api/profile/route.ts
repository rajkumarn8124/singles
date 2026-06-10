import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { age, bio, imageUrl, personalityTags, gender, interestedIn, preferredPersonality } = await request.json();

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { age: parseInt(age), bio, imageUrl, personalityTags, gender, interestedIn, preferredPersonality },
      create: {
        userId,
        age: parseInt(age),
        bio,
        imageUrl,
        personalityTags,
        gender,
        interestedIn,
        preferredPersonality,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { userId } });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
