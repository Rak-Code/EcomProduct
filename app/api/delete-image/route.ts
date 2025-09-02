import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This endpoint expects a POST with { publicId, docId }
export async function POST(req: NextRequest) {
  try {
    const { publicId } = await req.json();
    if (!publicId) {
      return NextResponse.json({ success: false, message: "public_id is required" }, { status: 400 });
    }
    const result = await cloudinary.v2.uploader.destroy(publicId);
    if (result.result !== "ok") {
      return NextResponse.json({ success: false, message: result.result || "Cloudinary delete failed" }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err: any) {
    console.error("Cloudinary delete error:", err);
    return NextResponse.json({ success: false, message: err.message || String(err) }, { status: 500 });
  }
}
