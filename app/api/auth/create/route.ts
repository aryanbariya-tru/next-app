import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";
import { ICreateUserPayload, IApiResponse, IUser, UserRole } from "@/app/types/user";


export const rolePermissions: Record<UserRole, UserRole[]> = {
  admin: ["principal", "teacher", "student"],
  principal: ["teacher", "student"],
  teacher: ["student"],
  student: [], // optional
};

export function canCreate(creatorRole: UserRole, newRole: UserRole): boolean {
  const allowedRoles = rolePermissions[creatorRole] || [];
  return allowedRoles.includes(newRole);
}


export async function GET(req: Request) {
  await connectToDatabase();

  const userEmail = req.headers.get("logged-email");
  const userRole = req.headers.get("logged-role");

  if (!userEmail || !userRole) {
    return NextResponse.json({ error: "No-One is logged-in" }, { status: 400 });
  }

  const users = await User.find({ createdBy: userEmail });
  console.log("Fetched users for", userEmail, ":", users);
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const data: ICreateUserPayload = await req.json();
    if (!data.name || !data.email || !data.role || !data.createdBy) {
      return NextResponse.json<IApiResponse>({
        error: "Name, email, role, and createdBy are required",
      }, { status: 400 });
    }

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return NextResponse.json<IApiResponse>({
        error: "Email already registered",
      }, { status: 409 });
    }

    const creator = await User.findOne({ email: data.createdBy });
    if (!creator) {
      return NextResponse.json<IApiResponse>({ error: "Invalid creator" }, { status: 403 });
    }

    if (!canCreate(creator.role, data.role)) {
      return NextResponse.json<IApiResponse>({
        error: `${creator.role} cannot create ${data.role}`,
      }, { status: 403 });
    }

    const newUser = await User.create(data);
    return NextResponse.json<IApiResponse<IUser>>({ success: true, user: newUser }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json<IApiResponse>({ error: "Server error" }, { status: 500 });
  }
}
