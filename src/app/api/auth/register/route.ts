import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // Token expires in 1 hour
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        verificationToken,
        tokenExpiry,
      },
    });

    // MOCK EMAIL SENDING
    console.log("\n=============================================");
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log("Subject: Verify your singles.com account");
    console.log(`Link: http://localhost:3000/verify-email?token=${verificationToken}`);
    console.log("=============================================\n");

    return NextResponse.json({ success: true, message: "Registration successful. Check console for verification link." });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
