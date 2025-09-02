"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { db } from "@/firebase"
import { collection, getDocs } from "firebase/firestore"

interface CarouselItem {
  title: string
  description: string
  cta: string
  link: string
  bgClass: string
  imageUrl: string
}

export default function HeroCarousel() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function fetchCarousel() {
      const snap = await getDocs(collection(db, "carousel"))
      setCarouselItems(snap.docs.map(doc => doc.data() as CarouselItem))
    }
    fetchCarousel()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (carouselItems.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [carouselItems.length])

  // Show a minimal loading state instead of null
  if (!carouselItems.length) {
    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 animate-pulse" />
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-in-out",
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <div className={`${item.bgClass} h-full py-16 md:py-24 px-6 md:px-12 relative`}>
              {item.imageUrl && (
                <>
                  <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover object-center z-0" />
                  <div className="absolute inset-0 bg-black/30 z-5"></div>
                </>
              )}
              <div className="container mx-auto max-w-4xl relative z-10">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">{item.title}</h1>
                <p className="text-lg md:text-xl text-white mb-8 max-w-2xl drop-shadow-md">{item.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  w-full sm:w-auto shadow-lg" 
                    asChild
                  >
                    <Link href={item.link}>{item.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-all shadow-lg">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-all shadow-lg">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      {/* Slider indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselItems.map((_, i) => (
          <button
            key={i}
            className={`h-3 transition-all shadow-sm ${
              currentSlide === i 
                ? "w-8 bg-[#d4af37]" 
                : "w-3 bg-white/60 hover:bg-white/80"
            } rounded-full`}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrentSlide(i)}
          />
        ))}
      </div>
    </div>
  )
}