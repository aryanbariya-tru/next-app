import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/mongodb";
import { Data } from "@/app/models/Data";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectToDatabase();
  const body = await req.json();
  const objectId = new mongoose.Types.ObjectId(id);
  const existing = await Data.findById(objectId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const updated = await Data.findByIdAndUpdate(objectId, body, { new: true });
  return NextResponse.json(updated);
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectToDatabase();
  const objectId = new mongoose.Types.ObjectId(id);
  const existing = await Data.findById(objectId);

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await Data.findByIdAndDelete(objectId);

  return NextResponse.json({ success: true });
}
