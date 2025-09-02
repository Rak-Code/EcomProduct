"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getProductById } from "@/lib/firebase/products"
import { db } from "@/firebase"
import { deleteDoc, doc } from "firebase/firestore"
import type { Product } from "@/lib/types"

export default function ProductDetailsPage(props: any) {
  const params = typeof window !== 'undefined' ? (props.params || (useParams && useParams())) : props.params;
  const unwrappedParams = typeof params?.then === "function" ? use(params) : params;
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      let id = unwrappedParams?.id;
      if (!id) return setLoading(false);
      const data = await getProductById(id);
      setProduct(data)
      setLoading(false)
    })();
  }, [unwrappedParams])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  const handleDeleteProduct = async () => {
    setIsDeleting(true)
    try {
      let id = unwrappedParams?.id;
      await deleteDoc(doc(db, "products", id))
      toast({
        title: "Product deleted",
        description: "The product has been permanently deleted.",
      })
      setIsDeleting(false)
      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: (error && typeof error === "object" && "message" in error)
          ? (error as { message: string }).message
          : "An error occurred while deleting the product.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">Product ID: {unwrappedParams?.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/${unwrappedParams?.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProduct} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Category</h3>
                    <p className="capitalize">{product.category}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Brand</h3>
                    <p>{product.brand}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Price</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-semibold">
                        ₹{product.discountPrice}
                        {product.discountPrice && (
                          <span className="ml-2 text-muted-foreground line-through text-lg">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Stock</h3>
                    <p>{product.stock} units</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Rating</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span>
                        {product.rating} ({(product.reviews?.length ?? 0)} reviews)
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Featured</h3>
                    <p>{product.featured ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Description</h3>
                <p>{product.description}</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
              <TabsTrigger value="sales">Sales Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>Reviews from customers who purchased this product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(product.reviews ?? []).map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <p className="text-xs text-muted-foreground">{typeof review.date === 'string' ? review.date : review.date.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/reviews">View All Reviews</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Sales metrics for this product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
                      <p className="text-2xl font-bold">{product.sales?.total ?? 0} units</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Last 30 Days</h3>
                      <p className="text-2xl font-bold">{product.sales?.lastMonth ?? 0} units</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                      <p className="text-2xl font-bold">₹{product.sales?.revenue}</p>
                    </div>
                  </div>
                  <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">Sales chart visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href={`/admin/products/${unwrappedParams?.id}/edit`}>Edit Product</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/products/${unwrappedParams?.id}`} target="_blank">
                  View on Store
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                Update Inventory
              </Button>
              <Button variant="outline" className="w-full">
                Add Promotion
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "2", name: "Elite Player Kashmir Willow Bat", price: 149.99 },
                  { id: "3", name: "Junior Academy Cricket Bat", price: 89.99 },
                  { id: "4", name: "Tournament Special Bat", price: 179.99 },
                ].map((relatedProduct) => (
                  <div key={relatedProduct.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{relatedProduct.name}</p>
                      <p className="text-sm text-muted-foreground">₹{relatedProduct.price}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/products/${relatedProduct.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
