"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    // Use a lower threshold (200px) for better mobile visibility
    // Use window.scrollY which is more widely supported
    const scrollY = window.scrollY || document.documentElement.scrollTop
    setIsVisible(scrollY > 200)
  }

  // Set the top coordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    // Call once on mount to check initial scroll position
    toggleVisibility()
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-[100] p-3  text-white rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  focus:outline-none focus:ring-2  focus:ring-offset-2 md:bottom-8 md:right-8"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}
    </>
  )
}
