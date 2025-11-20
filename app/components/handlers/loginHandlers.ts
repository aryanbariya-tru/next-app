import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";


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
        return NextResponse.json({ success: true, message:"login sucessfull" }, { status: 200 });

    }
    return NextResponse.json({ error: "email not registerd" }, { status: 403 });    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
