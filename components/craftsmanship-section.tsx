import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CraftsmanshipSection() {
  return (
    <section className="py-20 bg-premium-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">The Art of Craftsmanship</h2>
          <p className="text-muted-foreground text-lg">
            Every bat we create is a testament to our dedication to quality and tradition. From selecting the finest
            English willow to the final polish, our craftsmen pour their expertise into each piece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-lg shadow-premium hover:shadow-premium-hover transition-all duration-500">
            <Image
              src="/placeholder.svg?height=600&width=400"
              alt="Selecting the Willow"
              width={400}
              height={600}
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-medium mb-2">Selecting the Willow</h3>
              <p className="text-white/80 mb-4 text-sm">
                We source only the finest Grade 1 English willow, carefully examining each cleft for perfect grain
                structure.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg shadow-premium hover:shadow-premium-hover transition-all duration-500">
            <Image
              src="/placeholder.svg?height=600&width=400"
              alt="Handcrafted Shaping"
              width={400}
              height={600}
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-medium mb-2">Handcrafted Shaping</h3>
              <p className="text-white/80 mb-4 text-sm">
                Our master craftsmen shape each bat by hand, ensuring the perfect profile, balance, and weight
                distribution.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg shadow-premium hover:shadow-premium-hover transition-all duration-500">
            <Image
              src="/placeholder.svg?height=600&width=400"
              alt="Final Finishing"
              width={400}
              height={600}
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-medium mb-2">Final Finishing</h3>
              <p className="text-white/80 mb-4 text-sm">
                Each bat undergoes meticulous pressing, oiling, and polishing to enhance durability and performance.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 border-premium-blue text-premium-blue hover:bg-premium-blue hover:text-white"
          >
            <Link href="/about">Discover Our Story</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
