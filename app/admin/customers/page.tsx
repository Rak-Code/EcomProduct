"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore"

// Interface for customer data
interface Customer {
  id: string
  name: string
  email: string
  joined: string
  orders?: number
  spent?: number
  status?: string
  uid: string
  createdAt?: any
}

export default function AdminCustomersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("joined")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const db = getFirestore()
        const usersCollectionRef = collection(db, "users")
        const usersQuery = query(usersCollectionRef, orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(usersQuery)
        
        const customersData: Customer[] = []
        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          
          // Format the timestamp to a readable date
          const createdAt = userData.createdAt?.toDate ? 
            userData.createdAt.toDate().toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            }) : 'Unknown'
          
          customersData.push({
            id: doc.id,
            uid: userData.uid || doc.id,
            name: userData.name || userData.displayName || 'Unknown',
            email: userData.email || 'No email',
            joined: createdAt,
            orders: 0, // You'll need to calculate this from orders collection
            spent: 0, // You'll need to calculate this from orders collection
            status: userData.isAdmin ? "admin" : "active", // Default to active, you can adjust based on your user data
            createdAt: userData.createdAt
          })
        })
        
        setCustomers(customersData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching customers:", error)
        setError(error instanceof Error ? error : new Error('Unknown error occurred'))
        setLoading(false)
        toast({
          title: "Error",
          description: "Failed to load customers. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchCustomers()
  }, [toast])

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "joined") {
        // If using timestamp objects for sorting
        if (a.createdAt && b.createdAt) {
          return sortDirection === "asc"
            ? a.createdAt.seconds - b.createdAt.seconds
            : b.createdAt.seconds - a.createdAt.seconds
        }
        // Fallback to string date comparison
        return sortDirection === "asc"
          ? new Date(a.joined).getTime() - new Date(b.joined).getTime()
          : new Date(b.joined).getTime() - new Date(a.joined).getTime()
      } else if (sortField === "orders") {
        return sortDirection === "asc" ? (a.orders || 0) - (b.orders || 0) : (b.orders || 0) - (a.orders || 0)
      } else if (sortField === "spent") {
        return sortDirection === "asc" ? (a.spent || 0) - (b.spent || 0) : (b.spent || 0) - (a.spent || 0)
      }
      return 0
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <p className="text-red-500">Error loading customers: {error.message}</p>
            <Button 
              className="mt-4"
              onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer accounts</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/customers/export">Export Customers</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("joined")}>
                  Joined
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("orders")}>
                  Orders
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("spent")}>
                  Total Spent
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No customers found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.joined}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${(customer.spent || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(customer.status)}`}
                    >
                      {customer.status?.charAt(0).toUpperCase() + (customer.status?.slice(1) || '')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/customers/${customer.uid}`}>View Profile</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/customers/${customer.uid}/orders`}>View Orders</Link>
                      </Button>
                    </div>
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
