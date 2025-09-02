"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { placeOrder } from "@/lib/firebase/orders"
import Script from "next/script"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeStep, setActiveStep] = useState("shipping")
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentError, setPaymentError] = useState<string>("")
  const [isGuest, setIsGuest] = useState(!user)
  const [guestEmail, setGuestEmail] = useState("")

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.displayName || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  })

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })


  const subtotal = getCartTotal()
  // Shipping charges logic commented out for now. Uncomment to re-enable:
  // const shipping = subtotal > 1500 ? 0 : 100
  const shipping = 0 // Shipping is free for now
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    router.push("/cart")
    return null
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isGuest && !guestEmail) {
      toast({
        title: "Email required",
        description: "Please provide an email address for order confirmation.",
        variant: "destructive"
      })
      return
    }
    setActiveStep("payment")
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveStep("review")
  }

  // Razorpay handler
  const handleRazorpayPayment = async () => {
    setIsProcessing(true)
    setPaymentError("")
    try {
      const res = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, receipt: `order_rcptid_${Date.now()}` }),
      })
      const data = await res.json()
      if (!data.id) throw new Error("Failed to create Razorpay order")

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Paribito",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response: any) {
          // Here you should verify payment on server in production
          await handlePlaceOrder("paid", response)
        },
        prefill: { 
          name: user?.displayName || shippingAddress.fullName, 
          email: user?.email || guestEmail 
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            setPaymentError("Payment was cancelled or not completed.")
            toast({ title: "Payment Cancelled", description: "Payment was cancelled or not completed.", variant: "destructive" })
          }
        }
      }
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error: any) {
      toast({ title: "Payment failed", description: error.message, variant: "destructive" })
      setIsProcessing(false)
      setPaymentError(error.message)
    }
  }

  // Modified handlePlaceOrder to accept status and payment info
  const handlePlaceOrder = async (statusOverride?: string, paymentInfo?: any) => {
    setIsProcessing(true)
    try {
      // Generate a guest user ID if user is not logged in
      const userInfo = user ? {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
      } : {
        userId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userEmail: guestEmail,
        userName: shippingAddress.fullName,
        isGuest: true
      }

      const order = {
        ...userInfo,
        items: cartItems,
        total: total,
        address: `${shippingAddress.fullName}, ${shippingAddress.addressLine1}, ${shippingAddress.addressLine2}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}, ${shippingAddress.phone}`,
        status: statusOverride || (paymentMethod === "cod" ? "pending" : "paid"),
        paymentMethod,
        paymentInfo: paymentInfo || null,
        createdAt: Date.now(),
      }
      const orderId = await placeOrder(order)
      
      // Send order confirmation to customer
      try {
        const customerEmail = user?.email || guestEmail
        await fetch('/api/order-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: customerEmail, orderDetails: { ...order, id: orderId } }),
        })
      } catch (emailError) {
        console.error('Failed to send customer order confirmation email:', emailError)
      }
      
      // Send notification to admin
      try {
        console.log('Sending admin order notification with data:', { ...order, id: orderId });
        const adminNotificationResponse = await fetch('/api/admin-order-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderDetails: { ...order, id: orderId } }),
        });
        
        const adminNotificationResult = await adminNotificationResponse.json();
        console.log('Admin notification API response:', adminNotificationResponse.status, adminNotificationResult);
        
        if (!adminNotificationResponse.ok) {
          console.error('Admin notification API returned error:', adminNotificationResult);
        }
      } catch (adminEmailError) {
        console.error('Failed to send admin order notification email:', adminEmailError);
        if (adminEmailError instanceof Error) {
          console.error('Admin notification error details:', adminEmailError.message);
          console.error('Admin notification error stack:', adminEmailError.stack);
        }
      }
      
      clearCart()
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your order. We have received your order and will process it soon.",
        variant: "success",
        duration: 6000,
      })
      // Redirect to confirmation page with orderId
      router.push(`/order-confirmation?orderId=${orderId}`)
    } catch (error: any) {
      toast({ title: "Order failed", description: error.message, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  // Place order button logic
  const handlePlaceOrderClick = () => {
    if (paymentMethod === "cod") {
      handlePlaceOrder("pending")
    } else {
      handleRazorpayPayment()
    }
  }

  const updateShippingField = (field: string, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateCardField = (field: string, value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shipping" disabled={activeStep === "payment" || activeStep === "review"}>
                1. Shipping
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={activeStep === "shipping" || activeStep === "review"}>
                2. Payment
              </TabsTrigger>
              <TabsTrigger value="review" disabled={activeStep === "shipping" || activeStep === "payment"}>
                3. Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>Enter your shipping details</CardDescription>
                </CardHeader>
                <CardContent>
                  {!user && (
                    <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-semibold mb-3">Guest Checkout</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        You're checking out as a guest. Want to save your information for future orders?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          required
                          className="flex-1"
                        />
                        <Button variant="outline" asChild className="whitespace-nowrap">
                          <Link href="/login">Login Instead</Link>
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        By continuing, you agree to receive order updates via email.
                      </p>
                    </div>
                  )}
                  <form onSubmit={handleShippingSubmit} id="shipping-form" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={shippingAddress.fullName}
                          onChange={(e) => updateShippingField("fullName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={shippingAddress.phone}
                          onChange={(e) => updateShippingField("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={(e) => updateShippingField("addressLine1", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={(e) => updateShippingField("addressLine2", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => updateShippingField("city", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={shippingAddress.state}
                          onValueChange={(value) => updateShippingField("state", value)}
                        >
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="West Bengal">West Bengal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) => updateShippingField("postalCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={shippingAddress.country}
                        onValueChange={(value) => updateShippingField("country", value)}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/cart">Back to Cart</Link>
                  </Button>
                  <Button  className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " type="submit" form="shipping-form">
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you want to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} id="payment-form" className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer">
                          <img src="/razorpay.svg" alt="Razorpay" className="h-5 w-5" />
                          Razorpay (Card/UPI/Netbanking)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="16" height="12" x="4" y="6" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                          Cash on Delivery
                        </Label>
                      </div>
                    </RadioGroup>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep("shipping")}>
                    Back to Shipping
                  </Button>
                  <Button  className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " type="submit" form="payment-form">
                    Continue to Review
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                  <CardDescription>Please review your order details before placing it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className="border rounded-lg p-4 text-sm">
                      <p className="font-medium">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                      <p>
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      <p>Phone: {shippingAddress.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="border rounded-lg p-4 text-sm">
                      {paymentMethod === "razorpay" && (
                        <div className="flex items-center gap-2">
                          <img src="/razorpay.svg" alt="Razorpay" className="h-5 w-5" />
                          <span>Razorpay (Online Payment)</span>
                        </div>
                      )}
                      {paymentMethod === "cod" && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="16" height="12" x="4" y="6" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                          <span>Cash on Delivery</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="border rounded-lg divide-y">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex justify-between items-center p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.quantity} x</span>
                            <span>{item.product.name}</span>
                          </div>
                          <span className="font-medium">
                            ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep("payment")}>
                    Back to Payment
                  </Button>
                  <Button  className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " onClick={handlePlaceOrderClick} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-xl overflow-hidden sticky top-20">
            <div className="bg-muted px-6 py-4">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping charges row commented out for now. Uncomment to re-enable: */}
              {/*
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="pt-4 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Free shipping on orders over ₹8,300</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isProcessing && <div style={{ color: '#333', margin: '1rem 0' }}>Processing...</div>}
      {paymentError && <div style={{ color: 'red', margin: '1rem 0' }}>{paymentError}</div>}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setRazorpayLoaded(true)} />
    </div>
  )
}
