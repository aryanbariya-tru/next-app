import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { files: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;
    const files = formData.getAll("files") as File[];

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    const storedFiles: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      storedFiles.push(`/uploads/${fileName}`);
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        files: {
          create: storedFiles.map((url) => ({ url })),
        },
      },
      include: { files: true },
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit user" },
      { status: 500 }
    );
  }
}
