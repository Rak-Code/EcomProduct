import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function PremiumCollections() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Premium Collections</h2>
          <p className="text-muted-foreground text-lg">
            Explore our carefully curated collections designed for different playing styles and skill levels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-lg shadow-premium group">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Professional Series"
              width={800}
              height={600}
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-sm uppercase tracking-wider mb-2 text-white/80">For the Elite Player</p>
              <h3 className="text-2xl md:text-3xl font-medium mb-3">Professional Series</h3>
              <p className="text-white/90 mb-6 max-w-md">
                Handcrafted from the finest Grade 1+ English willow, our professional series bats are designed for elite
                performance.
              </p>
              <Button className="bg-white text-premium-blue hover:bg-white/90 rounded-full" asChild>
                <Link href="/products?collection=professional">
                  Explore Collection
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-premium group">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Academy Series"
              width={800}
              height={600}
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-sm uppercase tracking-wider mb-2 text-white/80">For the Developing Player</p>
              <h3 className="text-2xl md:text-3xl font-medium mb-3">Academy Series</h3>
              <p className="text-white/90 mb-6 max-w-md">
                Perfect for club cricketers and developing players, our Academy Series offers exceptional value without
                compromising on quality.
              </p>
              <Button className="bg-white text-premium-blue hover:bg-white/90 rounded-full" asChild>
                <Link href="/products?collection=academy">
                  Explore Collection
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="relative overflow-hidden rounded-lg shadow-premium group">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Junior Series"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-medium mb-2">Junior Series</h3>
              <p className="text-white/80 text-sm mb-4">
                Specially designed for young cricketers, focusing on proper weight and balance.
              </p>
              <Button size="sm" className="bg-white text-premium-blue hover:bg-white/90 rounded-full" asChild>
                <Link href="/products?collection=junior">View Collection</Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-premium group">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Limited Editions"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-medium mb-2">Limited Editions</h3>
              <p className="text-white/80 text-sm mb-4">
                Exclusive, limited-run bats with unique designs and premium features.
              </p>
              <Button size="sm" className="bg-white text-premium-blue hover:bg-white/90 rounded-full" asChild>
                <Link href="/products?collection=limited">View Collection</Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-premium group">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Accessories"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-medium mb-2">Premium Accessories</h3>
              <p className="text-white/80 text-sm mb-4">
                High-quality grips, protective gear, and maintenance products.
              </p>
              <Button size="sm" className="bg-white text-premium-blue hover:bg-white/90 rounded-full" asChild>
                <Link href="/products?category=accessories">View Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
