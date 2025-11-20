// app/components/handlers/authHandlers.ts
import { connectToDatabase } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";

// 1️⃣ Base Handler
export abstract class Handler {
  private nextHandler?: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(request: { token: string; data: string }): Promise<string> {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return request.data;
  }
}

// 2️⃣ Concrete Handlers
export class AuthHandler extends Handler {
  async handle(request: { token: string; data: string }): Promise<string> {
    await connectToDatabase();
    // Check user in MongoDB by name (token = name)

    const user = await User.findOne({ name:request.token });
   
    if (!user) {
      return "❌ Unauthorized: Invalid token (user not found).";
    }

    console.log(`✅ Auth passed for user: ${user.name}`);
    return super.handle(request);
  }
}

export class ValidationHandler extends Handler {
  async handle(request: { token: string; data: string }): Promise<string> {
    if (!request.data.trim()) {
      return "⚠️ Please enter some data.";
    }
    console.log("✅ Validation passed");
    return super.handle(request);
  }
}

export class ProcessingHandler extends Handler {
  async handle(request: { token: string; data: string }): Promise<string> {
    const processed = request.data.toUpperCase();
    console.log("✅ Processed data");
    return super.handle({ ...request, data: processed });
  }
}

export class ResponseHandler extends Handler {
  async handle(request: { token: string; data: string }): Promise<string> {
    const result = `🔐 Authorized! UpperCase message: ${request.data}`;
    return result;
  }
}
