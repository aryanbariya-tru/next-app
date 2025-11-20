import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { files: true },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      });
    }
    if ((await bcrypt.compare(password, user.password)) === false) {
      return NextResponse.json({
        success: false,
        error: "Password mismatch",
      });
    }

    const token = jwt.sign(
      {email: user.email },
      "defaultsecret",
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
