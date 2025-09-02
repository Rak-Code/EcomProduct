"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Plus, Trash, Edit3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { addProduct } from "@/lib/firebase/products"

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(["/placeholder.svg?height=400&width=300"])
  const [isManualSubcategory, setIsManualSubcategory] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    subcategory: "",
    productType: "",
    stock: "",
    brand: "Pariboto", // Adding default brand
    featured: false,
  })

  // Subcategory options based on main category
  const subcategoryOptions = {
    mens: [
      { value: "topwear", label: "Topwear" },
      { value: "bottomwear", label: "Bottomwear" },
      { value: "footwear", label: "Footwear" },
      { value: "activewear", label: "Activewear" },
      { value: "innerwear", label: "Innerwear" },
      { value: "accessories", label: "Accessories" }
    ],
    womens: [
      { value: "topwear", label: "Topwear" },
      { value: "bottomwear", label: "Bottomwear" },
      { value: "dresses", label: "Dresses" },
      { value: "footwear", label: "Footwear" },
      { value: "activewear", label: "Activewear" },
      { value: "innerwear", label: "Innerwear" },
      { value: "accessories", label: "Accessories" }
    ],
    kids: [
      { value: "boys", label: "Boys (2-14 years)" },
      { value: "girls", label: "Girls (2-14 years)" },
      { value: "infant-boys", label: "Infant Boys (0-2 years)" },
      { value: "infant-girls", label: "Infant Girls (0-2 years)" },
      { value: "footwear", label: "Footwear" },
      { value: "accessories", label: "Accessories" }
    ]
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      // Reset subcategory when category changes
      if (name === "category") {
        return { ...prev, [name]: value, subcategory: "" }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const toggleSubcategoryMode = () => {
    setIsManualSubcategory(!isManualSubcategory)
    // Clear subcategory when switching modes
    setFormData((prev) => ({ ...prev, subcategory: "" }))
  }

  const addImageField = () => {
    setImages([...images, "/placeholder.svg?height=400&width=300"])
  }

  const removeImageField = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Convert formData to correct types
      const product = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory,
        productType: formData.productType,
        stock: parseInt(formData.stock),
        brand: formData.brand,
        featured: formData.featured,
        images: images.filter((img) => !!img),
        rating: 0,
      }
      console.log("Product object before addProduct:", product)
      await addProduct(product)
      toast({
        title: "Product added successfully",
        description: "The product has been added to your inventory.",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Error object:", error)
      toast({
        title: "Error adding product",
        description: (error && typeof error === "object" && "message" in error)
          ? (error as { message: string }).message
          : "An error occurred while adding the product.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new clothing item in your inventory</p>
        </div>
      </div>
      <div className="mb-4">
        <Button asChild variant="outline" className="bg-pink-600 text-white hover:bg-pink-70 border border-pink-700">
          <Link href="/admin/products/image-upload">Image Upload</Link>
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of your clothing product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name (e.g., Cotton T-Shirt)" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mens">Mens</SelectItem>
                    <SelectItem value="womens">Womens</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Subcategory field - only show when category is selected */}
            {formData.category && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleSubcategoryMode}
                    className="h-8 px-2 text-xs"
                  >
                    {isManualSubcategory ? (
                      <>
                        <List className="mr-1 h-3 w-3" />
                        Use Dropdown
                      </>
                    ) : (
                      <>
                        <Edit3 className="mr-1 h-3 w-3" />
                        Custom Input
                      </>
                    )}
                  </Button>
                </div>
                
                {isManualSubcategory ? (
                  <Input
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    placeholder="Enter custom subcategory"
                    required
                  />
                ) : (
                  <Select value={formData.subcategory} onValueChange={(value) => handleSelectChange("subcategory", value)}>
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategoryOptions[formData.category as keyof typeof subcategoryOptions]?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {isManualSubcategory 
                    ? "Type a custom subcategory name" 
                    : "Select from predefined options or switch to custom input"
                  }
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter product description (materials, fit, care instructions, etc.)" rows={4} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input id="discountPrice" name="discountPrice" type="number" step="0.01" min="0" value={formData.discountPrice} onChange={handleChange} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} placeholder="0" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Select value={formData.productType} onValueChange={(value) => handleSelectChange("productType", value)}>
                  <SelectTrigger id="productType">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t-shirts">T-Shirts</SelectItem>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="jeans">Jeans</SelectItem>
                    <SelectItem value="trousers">Trousers</SelectItem>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="tops">Tops</SelectItem>
                    <SelectItem value="skirts">Skirts</SelectItem>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="hoodies">Hoodies</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                    <SelectItem value="activewear">Activewear</SelectItem>
                    <SelectItem value="loungewear">Loungewear</SelectItem>
                    <SelectItem value="underwear">Underwear</SelectItem>
                    <SelectItem value="sleepwear">Sleepwear</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => handleSwitchChange("featured", checked)} />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Add images of your clothing product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 h-24 border rounded-md overflow-hidden flex-shrink-0">
                  <img src={image || "/placeholder.svg"} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <Input type="text" value={image} onChange={(e) => {
                    const newImages = [...images]
                    newImages[index] = e.target.value
                    setImages(newImages)
                  }} placeholder="Image URL" />
                </div>
                <Button type="button" variant="outline" size="icon" onClick={() => removeImageField(index)} disabled={images.length === 1}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImageField} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Another Image
            </Button>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-pink-600 text-white hover:bg-pink-70 border border-pink-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}