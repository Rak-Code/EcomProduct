import { NextResponse } from "next/server";
import { sendAdminOrderNotification } from "@/lib/email/messaging";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { orderDetails } = await req.json();
    if (!orderDetails?.id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await sendAdminOrderNotification(orderDetails);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal Error" }, { status: 500 });
  }
}
// app/api/admin-order-notification/route.ts
import { NextResponse } from "next/server";
import { sendAdminOrderNotification } from "@/lib/email/messaging";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { orderDetails } = await req.json();
    if (!orderDetails?.id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await sendAdminOrderNotification(orderDetails);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Internal Error" }, { status: 500 });
  }
}
