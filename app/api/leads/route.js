import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const lead = await Lead.create({ name, email, phone });

    return NextResponse.json(
      {
        success: true,
        message: "Lead saved successfully!",
        data: lead,
      },
      { status: 201 }
    );
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 422 }
      );
    }

    // Duplicate email
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A lead with this email already exists." },
        { status: 409 }
      );
    }

    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: leads.length, data: leads },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
