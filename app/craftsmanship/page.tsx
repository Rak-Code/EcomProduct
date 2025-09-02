import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] bg-zsports-black">
        <div className="absolute inset-0 bg-gradient-to-r from-zsports-black to-transparent z-10"></div>
        <video
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
          autoPlay
          loop
          muted
          playsInline
          poster="/Craft1.jpg"
        >
          <source src="/Videos/CraftsmanshipVideo2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4">The Art of Craftsmanship</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                Discover the meticulous process behind every Z Sports cricket bat, where tradition meets innovation.
              </p>
              <Button
                className="bg-zsports-yellow text-zsports-black hover:bg-zsports-yellow-dark rounded-full px-8"
                asChild
              >
                <Link href="/products">
                  Explore Our Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Craftsmanship Philosophy</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At  72Sports, we believe that creating the perfect cricket bat is both an art and a science. Our
                philosophy is rooted in respecting traditional craftsmanship while embracing modern techniques to
                enhance performance.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Each bat we create is a testament to our dedication to quality and our passion for the game. We
                understand that a cricket bat is more than just equipment—it's an extension of the player.
              </p>
              <p className="text-lg text-muted-foreground">
                Our master craftsmen bring decades of experience to every bat they shape, ensuring that each one meets
                our exacting standards for balance, pickup, and performance.
              </p>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-premium">
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/Craft2.jpg"
              >
                <source src="/Videos/CraftsmanshipVideo1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">The Crafting Process</h2>
            <p className="text-muted-foreground text-lg">
              From raw willow to match-ready bat, our meticulous process ensures quality at every step.
            </p>
          </div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-zsports-yellow flex items-center justify-center text-zsports-black font-bold text-xl mr-4">
                    1
                  </div>
                  <h3 className="text-2xl font-medium">Selecting the Willow</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  We begin by carefully selecting premium Kashmir willow, examining each cleft for optimal grain
                  structure, density, and moisture content. Only the finest pieces make it to the next stage.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our experienced craftsmen can identify the potential of each piece of willow, ensuring that we start
                  with the best possible raw material for your bat.
                </p>
              </div>
              <div className="order-1 lg:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-premium">
                <Image
                  src="https://lh3.googleusercontent.com/p/AF1QipORdTiHGPtTlOtdsmAxVvpcj_o1NqBgbAeq65Hh=s1360-w1360-h1020-rw"
                  alt="Selecting the Willow"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-premium">
                <Image
                  src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nq8hDpFX3Bs-TGxrM4fenlyjYmYWbcPtBOuD3_bSjkTiZacQw9_MDHxiJ7gqTVT0Z2Ir-OwZBW9mW9GZkepC1aRwFdwFvzuRAAHyb72VMCcJCvd5LiCIJJrstt95oveJI0ajD54=s1360-w1360-h1020-rw"
                  alt="Shaping the Bat"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-zsports-yellow flex items-center justify-center text-zsports-black font-bold text-xl mr-4">
                    2
                  </div>
                  <h3 className="text-2xl font-medium">Shaping the Bat</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Using traditional tools and techniques, our craftsmen carefully shape each bat by hand. This process
                  requires precision and an intimate understanding of how the willow will perform.
                </p>
                <p className="text-lg text-muted-foreground">
                  We pay special attention to the profile, edges, and spine of the bat, ensuring that each one is
                  optimized for its intended playing style and player preference.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-zsports-yellow flex items-center justify-center text-zsports-black font-bold text-xl mr-4">
                    3
                  </div>
                  <h3 className="text-2xl font-medium">Pressing and Binding</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  After shaping, each bat undergoes a precise pressing process to compress the fibers and enhance
                  durability. This is followed by binding the handle to the blade with our proprietary technique.
                </p>
                <p className="text-lg text-muted-foreground">
                  The pressing process is crucial for achieving the right balance between power and durability. Too much
                  pressure reduces performance, while too little compromises longevity.
                </p>
              </div>
              <div className="order-1 lg:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-premium">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/Craft5.jpg"
                >
                  <source src="/Videos/CraftsmanshipVideo2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-premium">
                <Image
                  src="https://lh3.googleusercontent.com/p/AF1QipNBEKcyvScUaRkDQ-jydkTNA5uTxKKi2Oaz5YRM=s1360-w1360-h1020-rw"
                  alt="Finishing Touches"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-zsports-yellow flex items-center justify-center text-zsports-black font-bold text-xl mr-4">
                    4
                  </div>
                  <h3 className="text-2xl font-medium">Finishing Touches</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  The final stage involves multiple rounds of sanding, oiling, and polishing to protect the willow and
                  enhance its natural beauty. Each bat is then fitted with a premium grip and decals.
                </p>
                <p className="text-lg text-muted-foreground">
                  Before leaving our workshop, every bat undergoes rigorous quality control checks to ensure it meets
                  our exacting standards for weight, balance, pickup, and appearance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Our Quality Assurance</h2>
            <p className="text-muted-foreground text-lg">
              Every Z Sports bat undergoes rigorous testing to ensure it meets our high standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-premium hover:shadow-premium-hover transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-zsports-yellow/10 flex items-center justify-center mb-6">
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
                  className="text-zsports-yellow"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Durability Testing</h3>
              <p className="text-muted-foreground">
                Each bat undergoes stress testing to ensure it can withstand the rigors of competitive play and provide
                long-lasting performance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-premium hover:shadow-premium-hover transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-zsports-yellow/10 flex items-center justify-center mb-6">
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
                  className="text-zsports-yellow"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Performance Evaluation</h3>
              <p className="text-muted-foreground">
                We evaluate each bat for sweet spot size, ping, and power transfer to ensure it delivers optimal
                performance on the field.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-premium hover:shadow-premium-hover transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-zsports-yellow/10 flex items-center justify-center mb-6">
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
                  className="text-zsports-yellow"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Final Inspection</h3>
              <p className="text-muted-foreground">
                Before shipping, each bat undergoes a final inspection by our master craftsman to ensure it meets our
                exacting standards for quality and craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zsports-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Experience the Z Sports Difference</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Feel the difference that true craftsmanship makes. Explore our collection of premium cricket bats and
            elevate your game.
          </p>
          <Button
            className="bg-zsports-yellow text-zsports-black hover:bg-zsports-yellow-dark rounded-full px-8 py-6 text-lg"
            asChild
          >
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
