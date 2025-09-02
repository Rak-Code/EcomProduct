"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react"
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
import { fetchProducts, PaginatedProductsResult, deleteProduct } from "@/lib/firebase/products"
import type { Product } from "@/lib/types"

export default function AdminProductsPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [prevDocs, setPrevDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const loadProducts = async (direction: "next" | "prev" | null = null) => {
    setLoading(true)
    try {
      let startAfterDoc = null
      if (direction === "next") {
        startAfterDoc = lastVisible
      } else if (direction === "prev" && prevDocs.length > 1) {
        // Go back to the doc before the previous page
        startAfterDoc = prevDocs[prevDocs.length - 2]
      }
      const filters = {
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sort: sortField + (sortDirection === "asc" ? "-asc" : "-desc"),
      }
      const { products: fetched, lastVisible: newLastVisible } = await fetchProducts(filters, pageSize, startAfterDoc)
      setProducts(fetched)
      setLastVisible(newLastVisible)
      if (direction === "next") {
        setPrevDocs((prev) => [...prev, newLastVisible!])
        setPage((p) => p + 1)
      } else if (direction === "prev") {
        setPrevDocs((prev) => prev.slice(0, -1))
        setPage((p) => Math.max(1, p - 1))
      } else {
        setPrevDocs(newLastVisible ? [newLastVisible] : [])
        setPage(1)
      }
    } catch (e) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, sortField, sortDirection])

  // DEBUG: Log products after fetching
  useEffect(() => {
    console.log('Fetched products:', products)
  }, [products])

  // Filter and sort products (search only)
  const filteredProducts = products; // Show all products regardless of search

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (e) {
      alert("Error deleting product.");
    } finally {
      setDeletingId(null);
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bats">Bats</SelectItem>
              <SelectItem value="pads">Pads</SelectItem>
              <SelectItem value="gloves">Gloves</SelectItem>
              <SelectItem value="balls">Balls</SelectItem>
              <SelectItem value="helmets">Helmets</SelectItem>
              <SelectItem value="footwear">Footwear</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
        </div>
      ) : (
        <div>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                      Product Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("stock")}>
                      Stock
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium break-all max-w-[80px] md:max-w-none">{product.id}</TableCell>
                    <TableCell className="break-words max-w-[120px] md:max-w-none">{product.name}</TableCell>
                    <TableCell className="capitalize break-words max-w-[80px] md:max-w-none">{product.category}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-right break-words max-w-[80px] md:max-w-none">
                      ₹{product.price}
                    </TableCell>
                    <TableCell className="break-words max-w-[60px] md:max-w-none">{product.stock}</TableCell>
                    <TableCell>{product.featured ? "Featured" : "Active"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>
                            {deletingId === product.id ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={() => loadProducts("prev")}
              disabled={page === 1 || loading}
            >Previous</Button>
            <span>Page {page}</span>
            <Button variant="outline" onClick={() => loadProducts("next")}
              disabled={products.length < pageSize || loading}
            >Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
