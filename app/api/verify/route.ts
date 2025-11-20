import { NextResponse } from "next/server";
import {
  AuthHandler,
  ValidationHandler,
  ProcessingHandler,
  ResponseHandler,
} from "@/app/components/handlers/authHandlers";

export async function POST(req: Request) {
  try {
    const { token, data } = await req.json();

    const auth = new AuthHandler();
    const validate = new ValidationHandler();
    const process = new ProcessingHandler();
    const response = new ResponseHandler();
//Chain of Responsibility Pattern
    auth.setNext(validate).setNext(process).setNext(response);

    const result = await auth.handle({ token, data });

    return NextResponse.json({message: result});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
