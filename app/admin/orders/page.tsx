"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { getAllOrders, updateOrderStatus, deleteOrder } from "@/lib/firebase/orders"
import { useAuth } from "@/context/auth-context"

export default function AdminOrdersPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!user?.isAdmin) {
      console.log("User is not admin:", user);
      router.push("/")
      return
    }

    async function fetchOrders() {
      try {
        console.log("Fetching orders as admin:", user);
        setLoading(true)
        const allOrders = await getAllOrders()
        console.log("Fetched orders:", allOrders);
        setOrders(allOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (user?.isAdmin) {
      fetchOrders()
    }
  }, [user, router, toast])

  if (!user?.isAdmin) {
    return null
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.includes(searchQuery) ||
        (order.userName && order.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || orderStatuses[order.id] === statusFilter || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? (a.createdAt || 0) - (b.createdAt || 0)
          : (b.createdAt || 0) - (a.createdAt || 0)
      } else if (sortField === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total
      } else if (sortField === "id") {
        return sortDirection === "asc"
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id)
      }
      return 0
    })

  const getOrderItemsCount = (order: any) => Array.isArray(order.items) ? order.items.length : 0

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }))
    try {
      await updateOrderStatus(orderId, newStatus.toLowerCase())
      toast({
        title: "Order status updated",
        description: `Order #${orderId} has been updated to ${newStatus}.`,
      })
      setOrders((prevOrders) => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus.toLowerCase() } : order
      ))
    } catch (error) {
      toast({
        title: "Update failed",
        description: (error as Error).message || "Could not update order status.",
        variant: "destructive",
      })
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setDeletingId(id);
    try {
      const success = await deleteOrder(id);
      if (success) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        toast({ title: "Order deleted", description: `Order #${id} has been deleted.` });
      } else {
        toast({ title: "Failed to delete order", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error deleting order", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/orders/export">Export Orders</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name, or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("id")}>Order ID<ArrowUpDown className="ml-2 h-4 w-4" /></div>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>Date<ArrowUpDown className="ml-2 h-4 w-4" /></div>
              </TableHead>
              <TableHead>Items</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("total")}>Total<ArrowUpDown className="ml-2 h-4 w-4" /></div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">No orders found. Try adjusting your filters.</TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.userName || '-'}</div>
                      <div className="text-sm text-muted-foreground">{order.userEmail || '-'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{getOrderItemsCount(order)}</TableCell>
                  <TableCell>₹{order.total?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={orderStatuses[order.id] || order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id)} disabled={deletingId === order.id}>
                      {deletingId === order.id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
