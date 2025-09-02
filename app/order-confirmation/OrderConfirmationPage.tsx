"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center z-50">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
      <p className="text-lg text-muted-foreground mb-2">
        Your order has been placed successfully.<br />
        We appreciate your business and will process your order soon.
      </p>
      {orderId && (
        <p className="text-base text-gray-500 mb-6">Order ID: <span className="font-mono">{orderId}</span></p>
      )}
      <Button asChild>
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
