"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderConfirmation() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-green-100 p-6 mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for your order. We have received your order and will process it soon.<br />
        You can view your order status in <Link href="/profile" className="text-primary underline">My Account</Link>.
      </p>
      <Button asChild>
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  )
}
