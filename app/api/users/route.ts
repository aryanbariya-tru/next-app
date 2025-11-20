import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

// GET all users
export async function GET() {
  await connectToDatabase();
  const users = await User.find();
  return NextResponse.json(users);
}

// POST new user
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const newUser = await User.create(data);
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
