"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, MoreHorizontal, ArrowUpDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export default function AdminReviewsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { getAllReviews } = await import("@/lib/firebase/reviews")
        const data = await getAllReviews()
        setReviews(data)
      } catch (err) {
        setReviews([])
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch =
        (review.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRating = ratingFilter === "all" || String(review.rating) === ratingFilter
      const matchesStatus = statusFilter === "all" || review.status === statusFilter

      return matchesSearch && matchesRating && matchesStatus
    })
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? (a.createdAt || 0) - (b.createdAt || 0)
          : (b.createdAt || 0) - (a.createdAt || 0)
      } else if (sortField === "rating") {
        return sortDirection === "asc" ? a.rating - b.rating : b.rating - a.rating
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "flagged":
        return "bg-yellow-100 text-yellow-800"
      case "hidden":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    // TODO: Update review status in Firestore if you have a status field in the DB
    toast({
      title: "Review status updated",
      description: `Review has been ${newStatus}.`,
    })
    setReviews((prev) => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews for your products</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, product, or review content..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Rating" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("rating")}>
                  Rating
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Review</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            ) : filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No reviews found.</TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{review.userName ? review.userName[0] : 'U'}</AvatarFallback>
                      </Avatar>
                      <span>{review.userName || review.userEmail || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{review.productName || review.productId || 'N/A'}</TableCell>
                  <TableCell>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`inline h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={review.comment}>{review.comment}</TableCell>
                  <TableCell>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(review.status)}`}>
                      {review.status ? review.status.charAt(0).toUpperCase() + review.status.slice(1) : 'Published'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(review.id, "published")}>Publish</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(review.id, "flagged")}>Flag</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(review.id, "hidden")}>Hide</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
