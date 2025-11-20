import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { Data } from "@/app/models/Data";

// GET all users
export async function GET() {
  await connectToDatabase();
  const users = await Data.find();
  return NextResponse.json(users);
}


// POST new user
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    // Basic validation
    if (!data.name ) {
      return NextResponse.json({ error: "Name  are required" }, { status: 400 });
    }
    const existing = await Data.findOne({ name: data.name });
    if (existing) {
      return NextResponse.json({ error: "name already registered" }, { status: 409 });
    }

    const newUser = await Data.create(data);
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
