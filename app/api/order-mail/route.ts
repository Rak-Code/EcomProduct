import { NextResponse } from "next/server";
import { sendCustomerOrderEmail } from "@/lib/email/messaging";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userEmail, orderDetails } = await req.json();
    if (!userEmail || !orderDetails?.id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await sendCustomerOrderEmail(userEmail, orderDetails);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal Error" }, { status: 500 });
  }
}
// app/api/order-mail/route.ts
import { NextResponse } from "next/server";
import { sendCustomerOrderEmail } from "@/lib/email/messaging";

export const runtime = "nodejs"; // ensure Node APIs available for Nodemailer

export async function POST(req: Request) {
  try {
    const { userEmail, orderDetails } = await req.json();
    if (!userEmail || !orderDetails?.id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await sendCustomerOrderEmail(userEmail, orderDetails);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal Error" }, { status: 500 });
  }
}
