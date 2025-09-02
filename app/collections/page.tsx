import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function CollectionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <Image
          src="/hero-fashion.png"
          alt="Fashion Collections"
          fill
          className="object-cover object-center opacity-70"
        />
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4">Our Collections</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                Discover our curated fashion collections, designed with contemporary style and premium quality 
                for the modern wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="relative overflow-hidden rounded-lg shadow-2xl group">
              <Image
                src="/premium-collection.png"
                alt="Premium Collection"
                width={800}
                height={600}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-sm uppercase tracking-wider mb-2 text-white/80">Luxury Redefined</p>
                <h3 className="text-2xl md:text-3xl font-medium mb-3">Premium Collection</h3>
                <p className="text-white/90 mb-6 max-w-md">
                  Crafted from the finest fabrics with meticulous attention to detail. Our premium collection 
                  represents the pinnacle of contemporary fashion.
                </p>
                <Button
                  className="bg-white text-black hover:bg-gray-100 rounded-full font-medium"
                  asChild
                >
                  <Link href="/products?collection=premium">
                    Explore Collection
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg shadow-2xl group">
              <Image
                src="/streetwear-collection.png"
                alt="Streetwear Collection"
                width={800}
                height={600}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-sm uppercase tracking-wider mb-2 text-white/80">Urban Style</p>
                <h3 className="text-2xl md:text-3xl font-medium mb-3">Streetwear Collection</h3>
                <p className="text-white/90 mb-6 max-w-md">
                  Bold designs meet comfortable functionality. Perfect for those who want to make a statement 
                  while staying true to street culture aesthetics.
                </p>
                <Button
                  className="bg-white text-black hover:bg-gray-100 rounded-full font-medium"
                  asChild
                >
                  <Link href="/products?collection=streetwear">
                    Explore Collection
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="relative overflow-hidden rounded-lg shadow-xl group">
              <Image
                src="/casual-collection.png"
                alt="Casual Essentials"
                width={600}
                height={400}
                className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Casual Essentials</h3>
                <p className="text-white/80 text-sm mb-4">
                  Everyday comfort meets effortless style in our versatile casual collection.
                </p>
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100 rounded-full font-medium"
                  asChild
                >
                  <Link href="/products?collection=casual">View Collection</Link>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg shadow-xl group">
              <Image
                src="/formal-collection.png"
                alt="Formal Wear"
                width={600}
                height={400}
                className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Formal Wear</h3>
                <p className="text-white/80 text-sm mb-4">
                  Sophisticated pieces for professional settings and special occasions.
                </p>
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100 rounded-full font-medium"
                  asChild
                >
                  <Link href="/products?collection=formal">View Collection</Link>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg shadow-xl group">
              <Image
                src="/accessories-collection.png"
                alt="Accessories"
                width={600}
                height={400}
                className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Accessories</h3>
                <p className="text-white/80 text-sm mb-4">
                  Complete your look with our curated selection of premium accessories.
                </p>
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100 rounded-full font-medium"
                  asChild
                >
                  <Link href="/products?category=accessories">View Collection</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Why Choose Our Collections</h2>
            <p className="text-gray-600 text-lg">
              Every piece in our collections is thoughtfully designed with quality, style, and sustainability in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <path d="M12 19v3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Premium Fabrics</h3>
              <p className="text-gray-600">
                We source only the finest materials from trusted suppliers, ensuring comfort and durability in every piece.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Sustainable Production</h3>
              <p className="text-gray-600">
                Our commitment to environmental responsibility drives our sustainable manufacturing processes and ethical sourcing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Style Innovation</h3>
              <p className="text-gray-600">
                Our design team stays ahead of trends while creating timeless pieces that transcend seasonal fashion.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Perfect Fit</h3>
              <p className="text-gray-600">
                Extensive size ranges and thoughtful tailoring ensure a comfortable, flattering fit for every body type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Ready to Elevate Your Style?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Browse our complete collection and discover pieces that reflect your unique personality and style preferences.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 rounded-full font-medium px-8"
            asChild
          >
            <Link href="/products">
              Shop All Collections
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}