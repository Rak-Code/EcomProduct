"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getOrder } from "@/lib/firebase/orders"
import { addOrUpdateReview, deleteReview, getUserReviewForProduct } from "@/lib/firebase/reviews"

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  // All hooks declared at the top
  const { user } = useAuth()
  const [order, setOrder] = useState<any | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [localOrderDate, setLocalOrderDate] = useState<string | null>(null)
  const [reviewStates, setReviewStates] = useState<Record<string, { rating: number; comment: string; loading: boolean; editing: boolean; existing: boolean }>>({})
  const statuses = ["ordered", "processing", "shipped", "delivered"];
  const currentStep = order ? statuses.indexOf(order.status) : 0;

  // Fetch order
  useEffect(() => {
    async function fetchOrder() {
      if (params.id) {
        const o = await getOrder(params.id)
        setOrder(o)
      }
    }
    fetchOrder()
  }, [params.id])

  // Format date on client
  useEffect(() => {
    if (order?.createdAt) {
      setLocalOrderDate(new Date(order.createdAt).toLocaleString())
    }
  }, [order?.createdAt])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  // Fetch user review for each product after order loads
  useEffect(() => {
    async function fetchReviews() {
      if (order && user) {
        const states: Record<string, any> = {}
        for (const item of order.items || []) {
          const prodId = item.product.id
          const rev = await getUserReviewForProduct(prodId, user.uid)
          states[prodId] = rev
            ? { rating: rev.rating, comment: rev.comment, loading: false, editing: false, existing: true }
            : { rating: 0, comment: "", loading: false, editing: false, existing: false }
        }
        setReviewStates(states)
      }
    }
    fetchReviews()
    // eslint-disable-next-line
  }, [order, user])

  // Review submit handler
  const handleReviewSubmit = async (productId: string) => {
    if (!user) return
    const reviewData = {
      productId,
      userId: user.uid,
      userName: user.displayName || user.email || "User",
      rating: reviewStates[productId].rating,
      comment: reviewStates[productId].comment,
    }
    console.log("Submitting review:", reviewData)
    setReviewStates((prev) => ({ ...prev, [productId]: { ...prev[productId], loading: true } }))
    try {
      await addOrUpdateReview(reviewData)
      setReviewStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], loading: false, editing: false, existing: true },
      }))
      toast({ title: "Review submitted!" })
    } catch (err) {
      setReviewStates((prev) => ({ ...prev, [productId]: { ...prev[productId], loading: false } }))
      toast({ title: "Failed to submit review", variant: "destructive" })
      console.error("Review submission error:", err)
    }
  }

  // Review delete handler
  const handleReviewDelete = async (productId: string) => {
    if (!user) return
    setReviewStates((prev) => ({ ...prev, [productId]: { ...prev[productId], loading: true } }))
    try {
      await deleteReview(productId, user.uid)
      setReviewStates((prev) => ({
        ...prev,
        [productId]: { rating: 0, comment: "", loading: false, editing: false, existing: false },
      }))
      toast({ title: "Review deleted" })
    } catch (err) {
      setReviewStates((prev) => ({ ...prev, [productId]: { ...prev[productId], loading: false } }))
      toast({ title: "Failed to delete review", variant: "destructive" })
    }
  }

  // Only after all hooks, do your early returns:
  if (!user) return null
  if (!order) return <div>Loading...</div>

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <Package className="h-6 w-6 text-primary" />
      case "processing":
        return <Package className="h-6 w-6 text-yellow-500" />
      case "shipped":
        return <Truck className="h-6 w-6 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Package className="h-6 w-6" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Order #{order.id}</h2>
            <div className="text-muted-foreground text-sm">Placed on: {localOrderDate || '-'}</div>
            <div className="text-muted-foreground text-sm">Status: <span className="font-semibold">{order.status}</span></div>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            {getStatusIcon(order.status)}
          </div>
        </div>
        {/* Status Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {statuses.map((status, idx) => (
            <div key={status} className="flex-1 flex flex-col items-center">
              <div className={`rounded-full p-2 border-2 ${idx <= currentStep ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-100'}`}>{getStatusIcon(status)}</div>
              <span className={`mt-2 text-xs font-semibold ${idx <= currentStep ? 'text-primary' : 'text-gray-400'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              {idx < statuses.length - 1 && (
                <div className={`h-1 w-full ${idx < currentStep ? 'bg-primary' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        {/* End Status Progress Bar */}
        <Separator className="mb-6" />
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <div>{order.address || '-'}</div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? order.items.map((item: any, idx: number) => {
                  const prodId = item.product.id
                  console.log("Order item:", JSON.stringify(item, null, 2));
                  return (
                    <tr key={prodId}>
                      <td className="px-4 py-2">{item.product.name}
                        {/* Review Section for delivered orders */}
                        {order.status === "delivered" && (
                          <div className="mt-2">
                            {reviewStates[prodId]?.editing ? (
                              <div className="border rounded p-2 bg-gray-50">
                                <div className="flex gap-2 mb-1">
                                  {[1,2,3,4,5].map(star => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setReviewStates(prev => ({ ...prev, [prodId]: { ...prev[prodId], rating: star } }))}
                                      className={star <= (reviewStates[prodId]?.rating || 0) ? "text-yellow-500" : "text-gray-300"}
                                    >★</button>
                                  ))}
                                </div>
                                <textarea
                                  className="w-full border rounded mb-2 p-1 text-sm"
                                  rows={2}
                                  placeholder="Write your review..."
                                  value={reviewStates[prodId]?.comment || ""}
                                  onChange={e => setReviewStates(prev => ({ ...prev, [prodId]: { ...prev[prodId], comment: e.target.value } }))}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" disabled={reviewStates[prodId]?.loading} onClick={() => handleReviewSubmit(prodId)}>
                                    {reviewStates[prodId]?.existing ? "Update" : "Submit"}
                                  </Button>
                                  {reviewStates[prodId]?.existing && (
                                    <Button size="sm" variant="destructive" disabled={reviewStates[prodId]?.loading} onClick={() => handleReviewDelete(prodId)}>
                                      Delete
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" onClick={() => setReviewStates(prev => ({ ...prev, [prodId]: { ...prev[prodId], editing: false } }))}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => setReviewStates(prev => ({ ...prev, [prodId]: { ...prev[prodId], editing: true } }))}>
                                {reviewStates[prodId]?.existing ? "Edit Review" : "Leave Review"}
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">₹{item.price?.toFixed(2)}</td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan={3} className="px-4 py-2 text-center">No items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end items-center gap-8">
          <div className="text-lg font-semibold">Total: ₹{order.total?.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
