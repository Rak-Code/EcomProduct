"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart,
  LineChart,
  PieChart,
  Download,
  Calendar,
  DollarSign,
  ShoppingCart,
  Calculator,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RevenueAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [averageOrderValue, setAverageOrderValue] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const { getAllOrders } = await import("@/lib/firebase/orders")
        const fetchedOrders = await getAllOrders()
        setOrders(fetchedOrders)
        const revenue = fetchedOrders.reduce((sum, o) => sum + (o.total || 0), 0)
        setTotalRevenue(revenue)
        setOrderCount(fetchedOrders.length)
        setAverageOrderValue(fetchedOrders.length > 0 ? revenue / fetchedOrders.length : 0)
      } catch (err) {
        setOrders([])
        setTotalRevenue(0)
        setOrderCount(0)
        setAverageOrderValue(0)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [timeRange])

  useEffect(() => {
    const computeMonthlyRevenue = (orders) => {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const now = new Date();
      const result = [];
      for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();
        const revenue = orders.filter(o => {
          const od = new Date(o.createdAt);
          return od.getMonth() === d.getMonth() && od.getFullYear() === year;
        }).reduce((sum, o) => sum + (o.total || 0), 0);
        result.push({ month: monthName, revenue });
      }
      // Calculate % change
      return result.map((item, idx, arr) => {
        if (idx === 0) return { ...item, change: "--" };
        const prev = arr[idx - 1].revenue;
        const change = prev === 0 ? "--" : `${((item.revenue - prev) / prev * 100).toFixed(0)}%`;
        return { ...item, change: change.startsWith("-") ? change : `+${change}` };
      });
    };

    const computeTopProducts = async (orders) => {
      const productMap = {};
      orders.forEach(order => {
        (order.items || []).forEach(item => {
          if (!productMap[item.name]) {
            productMap[item.name] = { name: item.name, units: 0, revenue: 0 };
          }
          productMap[item.name].units += item.quantity || 1;
          productMap[item.name].revenue += (item.price || 0) * (item.quantity || 1);
        });
      });
      const arr = Object.values(productMap);
      arr.sort((a, b) => b.revenue - a.revenue);
      return arr.slice(0, 5);
    };

    if (!loading && orders.length > 0) {
      setMonthlyRevenue(computeMonthlyRevenue(orders));
      computeTopProducts(orders).then(setTopProducts);
    }
  }, [orders, loading]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Revenue Analytics</h1>
          <p className="text-muted-foreground">Track your sales performance and revenue metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `₹${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +20.1%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : orderCount}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +12.4%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `₹${averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +5.2%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 inline-flex items-center">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                -0.3%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Daily revenue for the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <LineChart className="h-16 w-16" />
                <p>Revenue chart visualization would appear here</p>
                <p className="text-sm">
                  Showing data for{" "}
                  {timeRange === "week"
                    ? "the last 7 days"
                    : timeRange === "month"
                      ? "the last 30 days"
                      : timeRange === "quarter"
                        ? "the last 3 months"
                        : "the last 12 months"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products with the highest revenue</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart className="h-16 w-16" />
                <p>Product performance chart would appear here</p>
                <p className="text-sm">Showing top 10 products by revenue</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Distribution of revenue across product categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PieChart className="h-16 w-16" />
                <p>Category distribution chart would appear here</p>
                <p className="text-sm">Showing percentage of revenue by product category</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : monthlyRevenue.length === 0 ? (
                <div>No data</div>
              ) : monthlyRevenue.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{item.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">₹{item.revenue.toLocaleString()}</span>
                    <span className={item.change.startsWith("+") ? "text-green-500" : item.change.startsWith("-") ? "text-red-500" : "text-gray-500"}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
            <CardDescription>Products with highest sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : topProducts.length === 0 ? (
                <div>No data</div>
              ) : topProducts.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.units} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
