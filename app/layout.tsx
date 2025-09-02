import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { Toaster } from "@/components/ui/toaster"
import { ProductProvider } from "@/context/product-context"
import ScrollToTop from "@/components/scroll-to-top"
import ErrorBoundary from "@/components/error-boundary"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
title: "Paribito | Contemporary Clothing for Modern Expression",
description: "Elevate your everyday style with Paribito – premium clothing that blends timeless design with modern edge.",
generator: "https://rakesh-gupta-portfolio-next-js-six.vercel.app/"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/x-icon" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <ProductProvider>
                    <div className="flex min-h-screen flex-col">
                      <ErrorBoundary>
                        <Navbar />
                      </ErrorBoundary>
                      <main className="flex-1">
                        <ErrorBoundary>
                          {children}
                        </ErrorBoundary>
                      </main>
                      <ErrorBoundary>
                        <Footer />
                      </ErrorBoundary>
                      <ScrollToTop />
                    </div>
                    <Toaster />
                  </ProductProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

import './globals.css'