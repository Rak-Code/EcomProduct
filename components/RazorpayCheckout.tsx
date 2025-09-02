"use client";
import React from "react";

interface RazorpayCheckoutProps {
  amount: number; // in INR
  orderId: string;
  user: { name: string; email: string; contact: string };
  orderData: any; // The order data to save in Firestore if payment succeeds
  onSuccess: (orderId: string) => void;
  onError: (error: any) => void;
}

export const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ amount, orderId, user, orderData, onSuccess, onError }) => {
  const openRazorpay = async () => {
    if (!(window as any).Razorpay) {
      await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }
    // Ensure userEmail is present in orderData
    const enrichedOrderData = {
      ...orderData,
      userEmail: user.email,
      userName: user.name,
    };
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: amount * 100, // paise
      currency: "INR",
      name: "Paribito",
      order_id: orderId,
      handler: async function (response: any) {
        // Call backend to verify payment and place order
        try {
          const verifyRes = await fetch("/api/razorpay-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: enrichedOrderData,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onSuccess(verifyData.orderId);
          } else {
            onError(verifyData.error || "Payment verification failed");
          }
        } catch (err) {
          onError(err);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: function () {
          onError("Payment was cancelled or not completed.");
        }
      }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  return (
    <button type="button" onClick={openRazorpay} className="bg-black text-white px-4 py-2 rounded">
      Pay with Razorpay
    </button>
  );
};
