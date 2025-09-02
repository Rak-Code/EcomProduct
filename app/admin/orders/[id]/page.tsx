"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getOrder, updateOrderStatus } from "@/lib/firebase/orders"
import html2pdf from "html2pdf.js"
import React, { useRef } from "react"

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [order, setOrder] = useState<any | null>(null)

  const invoiceRef = useRef<HTMLDivElement>(null)

  const handlePrintInvoice = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload()
    }
  }

  const handleDownloadInvoice = () => {
    if (invoiceRef.current) {
      html2pdf().from(invoiceRef.current).save(`invoice-${order.id}.pdf`)
    }
  }

  useEffect(() => {
    async function fetchOrder() {
      if (params.id) {
        const o = await getOrder(params.id)
        setOrder(o)
      }
    }
    fetchOrder()
  }, [params.id])

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin mr-2" /> Loading order details...
      </div>
    )
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast({
        title: "Status required",
        description: "Please select a status to update.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      // Always save status as lowercase
      const statusToSave = newStatus.toLowerCase()
      await updateOrderStatus(params.id, statusToSave)
      toast({
        title: "Order status updated",
        description: `Order #${params.id} has been updated to ${statusToSave}.`,
      })
      // Refetch order to update UI
      const updatedOrder = await getOrder(params.id)
      setOrder(updatedOrder)
      setNewStatus("")
      setStatusNote("")
    } catch (error) {
      toast({
        title: "Update failed",
        description: (error as Error).message || "Could not update order status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order #{params.id}</h1>
          <p className="text-muted-foreground">Placed on {order.date}</p>
        </div>
        <div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(order.status)}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price?.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">per unit</p>
                  </div>
                </div>
              )) : (
                <div>No items found.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <p className="text-sm">{order.userName || '-'}</p>
                <p className="text-sm">{order.userEmail || '-'}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm">{order.address || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline && order.timeline.length > 0 ? order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-24 text-sm text-muted-foreground">
                      {event.date}
                      <br />
                      {event.time}
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-1 ${getStatusBadgeClass(event.status)}`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      <p className="text-sm">{event.note}</p>
                    </div>
                  </div>
                )) : <div>No timeline events.</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal ? order.subtotal.toFixed(2) : order.total ? order.total.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : order.shipping ? `₹${order.shipping.toFixed(2)}` : "-"}</span>
              </div>
              {order.tax ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
              ) : null}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.total ? order.total.toFixed(2) : '0.00'}</span>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-sm">{order.paymentMethod || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change the current order status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Status Note</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note about this status update"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleUpdateStatus} disabled={isUpdating || !newStatus}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Actions */}
      <div className="flex gap-4 my-4">
        <Button onClick={handlePrintInvoice} variant="outline">Print Invoice</Button>
        <Button onClick={handleDownloadInvoice} variant="outline">Download Invoice</Button>
      </div>

      {/* Invoice Section (hidden on screen, visible for print/download) */}
      <div ref={invoiceRef} style={{ display: 'none' }} className="invoice-print-area p-8 bg-white text-black">
        <h2 className="text-2xl font-bold mb-2">Invoice</h2>
        <div className="mb-4">
          <div><strong>Order ID:</strong> {order.id}</div>
          <div><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
          <div><strong>Status:</strong> {order.status}</div>
        </div>
        <div className="mb-4">
          <div><strong>Customer:</strong> {order.userName || '-'} ({order.userEmail || '-'})</div>
          <div><strong>Shipping Address:</strong> {order.address}</div>
        </div>
        <table className="w-full border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item: any, idx: number) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.quantity}</td>
                <td className="border px-2 py-1">₹{item.price?.toFixed(2)}</td>
                <td className="border px-2 py-1">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-bold text-lg">
          Total: ₹{order.total?.toFixed(2)}
        </div>
        <div className="mt-8 text-sm text-gray-600">
          <div><strong>72Sports</strong></div>
          <div>www.72sports.com</div>
          <div>support@72sports.com</div>
        </div>
      </div>
    </div>
  )
}
