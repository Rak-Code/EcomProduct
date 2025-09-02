"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Users, Package, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, Star, BarChart, TrendingUp, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { collection, getCountFromServer, getFirestore } from "firebase/firestore"
import { fetchProducts } from "@/lib/firebase/products"
import ImageUploadPage from "./products/image-upload/page";
import type { Order } from "@/lib/firebase/orders"
import StoreOverviewChart from "@/components/store-overview-chart"

export default function AdminDashboard() {
  const [customerCount, setCustomerCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productCount, setProductCount] = useState<number>(0)
  const [orderCount, setOrderCount] = useState<number | null>(null)
  const [revenue, setRevenue] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState<number | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true)
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const db = getFirestore()
        const usersCollection = collection(db, "users")
        const snapshot = await getCountFromServer(usersCollection)
        setCustomerCount(snapshot.data().count)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customer count")
        setLoading(false)
      }
    }

    const fetchProductCount = async () => {
      try {
        const { products } = await fetchProducts()
        setProductCount(products.length)
      } catch (err) {
        setProductCount(0)
      }
    }

    const fetchOrderStats = async () => {
      try {
        const { getAllOrders } = await import("@/lib/firebase/orders")
        const orders = await getAllOrders()
        setOrderCount(orders.length)
        let totalRevenue = 0
        orders.forEach(order => {
          if (order.total) totalRevenue += order.total
        })
        setRevenue(totalRevenue)
      } catch (err) {
        setOrderCount(0)
        setRevenue(0)
      }
    }

    const fetchReviewStats = async () => {
      try {
        const { getAllReviews } = await import("@/lib/firebase/reviews")
        const reviews = await getAllReviews()
        setReviewCount(reviews.length)
        // Get recent reviews (last 5)
        const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5)
        setRecentReviews(sortedReviews)
      } catch (err) {
        setReviewCount(0)
        setRecentReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    const fetchRecentOrders = async () => {
      try {
        const { getAllOrders } = await import("@/lib/firebase/orders")
        const orders = await getAllOrders()
        const sorted = orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)
        setRecentOrders(sorted)
      } catch (err) {
        setRecentOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchCustomerCount()
    fetchProductCount()
    fetchOrderStats()
    fetchReviewStats()
    fetchRecentOrders()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      processing: { variant: "default" as const, label: "Processing" },
      shipped: { variant: "outline" as const, label: "Shipped" },
      delivered: { variant: "destructive" as const, label: "Delivered" },
      cancelled: { variant: "secondary" as const, label: "Cancelled" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 overflow-hidden rounded-full border-4  bg-white shadow-lg flex items-center justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt="Paribito Logo"
                  width={56}
                  height={56}
                  className="object-contain w-12 h-12"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your store operations and monitor performance</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/admin/products/new">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] transition-all duration-200">
              <Link href="/admin/carousel">
                <Activity className="mr-2 h-4 w-4" />
                Manage Carousel
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Link href="/admin/products" className="group">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-pink-50 group-hover:to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Products</CardTitle>
                <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                  <Package className="h-4 w-4 text-[#d4af37]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {productCount.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Active listings</span>
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders" className="group">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Orders</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {orderCount !== null ? orderCount.toLocaleString() : '...'}
                </div>
                <p className="text-xs text-gray-600 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Total orders</span>
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/customers" className="group">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Customers</CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-2xl font-bold text-gray-400">Loading...</div>
                ) : error ? (
                  <div className="text-red-500 text-sm">Error loading</div>
                ) : (
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {customerCount !== null ? customerCount.toLocaleString() : '0'}
                  </div>
                )}
                <p className="text-xs text-gray-600 flex items-center">
                  <Users className="mr-1 h-3 w-3 text-purple-500" />
                  <span className="text-purple-600 font-medium">Registered users</span>
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/revenue" className="group">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-emerald-50 group-hover:to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Revenue</CardTitle>
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {revenue !== null ? formatCurrency(revenue) : '...'}
                </div>
                <p className="text-xs text-gray-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Total earnings</span>
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reviews" className="group">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Reviews</CardTitle>
                <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <Star className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {reviewCount !== null ? reviewCount.toLocaleString() : '...'}
                </div>
                <p className="text-xs text-gray-600 flex items-center">
                  <Star className="mr-1 h-3 w-3 text-amber-500" />
                  <span className="text-amber-600 font-medium">Customer feedback</span>
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions and Store Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                asChild
                className="h-auto py-6 justify-start bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] transition-all duration-200 group border-0"
              >
                <Link href="/admin/products/new">
                  <div className="p-2 bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] rounded-lg mr-3 group-hover:from-[#c99700] group-hover:via-[#b8860b] group-hover:to-[#a97400] transition-colors">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Add Product</div>
                    <div className="text-xs text-gray-100 mt-1">Create new product listing</div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 justify-start border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 group"
              >
                <Link href="/admin/orders">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Manage Orders</div>
                    <div className="text-xs text-gray-500 mt-1">View and update orders</div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 justify-start border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 hover:text-amber-800 transition-all duration-200 group"
              >
                <Link href="/admin/reviews">
                  <div className="p-2 bg-amber-100 rounded-lg mr-3 group-hover:bg-amber-200 transition-colors">
                    <Star className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Review Management</div>
                    <div className="text-xs text-gray-500 mt-1">Moderate feedback</div>
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 justify-start border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 transition-all duration-200 group"
              >
                <Link href="/admin/revenue">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3 group-hover:bg-emerald-200 transition-colors">
                    <BarChart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Revenue Analytics</div>
                    <div className="text-xs text-gray-500 mt-1">View sales performance</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Store Analytics</CardTitle>
              <CardDescription className="text-gray-600">Live store stats and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-4">
                  <span className="text-lg font-semibold text-gray-700">Products</span>
                  <span className="text-3xl font-bold text-pink-600">{productCount}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                  <span className="text-lg font-semibold text-gray-700">Orders</span>
                  <span className="text-3xl font-bold text-blue-600">{orderCount !== null ? orderCount : '...'}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                  <span className="text-lg font-semibold text-gray-700">Customers</span>
                  <span className="text-3xl font-bold text-purple-600">{customerCount !== null ? customerCount : '...'}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                  <span className="text-lg font-semibold text-gray-700">Revenue</span>
                  <span className="text-3xl font-bold text-emerald-600">{revenue !== null ? formatCurrency(revenue) : '...'}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                  <span className="text-lg font-semibold text-gray-700">Reviews</span>
                  <span className="text-3xl font-bold text-amber-600">{reviewCount !== null ? reviewCount : '...'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-1 flex flex-wrap md:flex-nowrap overflow-x-auto">
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-700 data-[state=active]:text-white min-w-[140px] flex-1 text-center rounded-lg transition-all duration-200 data-[state=active]:shadow-lg"
            >
              Recent Orders
            </TabsTrigger>
            <TabsTrigger 
              value="image-management" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-[#d4af37] data-[state=active]:text-white min-w-[140px] flex-1 text-center rounded-lg transition-all duration-200 data-[state=active]:shadow-lg"
            >
              Image Management
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-[#d4af37] data-[state=active]:text-white min-w-[140px] flex-1 text-center rounded-lg transition-all duration-200 data-[state=active]:shadow-lg"
            >
              Latest Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Orders</CardTitle>
                <CardDescription className="text-gray-600">Latest orders and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-[600px] md:min-w-0 w-full">
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Total</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 bg-[#d4af37] rounded-full animate-pulse"></div>
                              <span>Loading orders...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : recentOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No recent orders found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentOrders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="font-mono text-sm">
                              #{order.id?.slice(-8).toUpperCase() ?? ''}
                            </TableCell>
                            <TableCell className="font-medium">
                              {order.userName || order.userEmail?.split('@')[0] || 'Guest'}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }) : ''}
                            </TableCell>
                            <TableCell>
                              <Select
                                defaultValue={order.status}
                                onValueChange={async (value) => {
                                  if (!order.id) return;
                                  const { updateOrderStatus } = await import("@/lib/firebase/orders")
                                  await updateOrderStatus(order.id as string, value)
                                  setRecentOrders((prev) => prev.map(o => o.id === order.id ? { ...o, status: value } : o))
                                }}
                              >
                                <SelectTrigger className="h-8 w-[130px] border-gray-200">
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
                            <TableCell className="font-semibold text-gray-900">
                              {order.total ? formatCurrency(order.total) : '₹0'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild 
                                className="hover:bg-gradient-to-r hover:from-[#d4af37] hover:via-[#c99700] hover:to-[#b8860b] hover:text-white transition-colors"
                              >
                                <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {recentOrders.length > 0 && (
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  transition-all duration-200"
                    >
                      <Link href="/admin/orders">View All Orders</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image-management" className="space-y-4">
            <ImageUploadPage />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Latest Reviews</CardTitle>
                <CardDescription className="text-gray-600">Recent customer feedback and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700">Product</TableHead>
                        <TableHead className="font-semibold text-gray-700">Rating</TableHead>
                        <TableHead className="font-semibold text-gray-700">Comment</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 bg-[#d4af37] rounded-full animate-pulse"></div>
                              <span>Loading reviews...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : recentReviews.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No reviews found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentReviews.map((review) => (
                          <TableRow key={review.id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="font-medium">
                              {review.userName || review.userEmail?.split('@')[0] || 'Anonymous'}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {review.productName || 'Product'}
                            </TableCell>
                            <TableCell>
                              {renderStars(review.rating || 0)}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {review.comment || 'No comment'}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }) : ''}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                asChild 
                                className="hover:bg-amber-50 hover:text-amber-700 transition-colors"
                              >
                                <Link href={`/admin/reviews/${review.id}`}>View Details</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {recentReviews.length > 0 && (
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 hover:text-amber-800 transition-all duration-200"
                    >
                      <Link href="/admin/reviews">View All Reviews</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}