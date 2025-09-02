"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const heroSlides = [
  {
    title: "Craftsmanship in Every Stroke",
    subtitle: "Premium English Willow Bats",
    description: "Handcrafted with precision and care for the perfect balance, weight, and performance.",
    image: "/placeholder.svg?height=800&width=1200",
    cta: "Explore Collection",
    link: "/products?category=bats",
  },
  {
    title: "Uncompromising Protection",
    subtitle: "Professional Grade Equipment",
    description: "Designed for comfort and safety, our protective gear gives you confidence at the crease.",
    image: "/placeholder.svg?height=800&width=1200",
    cta: "Shop Protection",
    link: "/products?category=protection",
  },
  {
    title: "Precision in Every Detail",
    subtitle: "Tournament Quality Accessories",
    description: "From premium leather balls to specialized grips, every accessory is crafted for excellence.",
    image: "/placeholder.svg?height=800&width=1200",
    cta: "View Accessories",
    link: "/products?category=accessories",
  },
]

export default function PremiumHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goToSlide = (index: number) => {
    if (index === currentSlide || isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % heroSlides.length
      goToSlide(nextSlide)
    }, 6000)
    return () => clearInterval(interval)
  }, [currentSlide])

  return (
    <div className="relative h-[80vh] min-h-[600px] max-h-[800px] w-full overflow-hidden bg-premium-blue">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
          <div className="relative z-20 h-full w-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl animate-fade-in">
                <p className="text-sm md:text-base uppercase tracking-wider text-white/80 mb-2 font-light">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">{slide.description}</p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-white text-premium-blue hover:bg-white/90 rounded-full px-8" asChild>
                    <Link href={slide.link}>
                      {slide.cta}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/70",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
