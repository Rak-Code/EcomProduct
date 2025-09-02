// Add 'use client' directive at the top for Next.js app directory compatibility with framer-motion
"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Star,
  ArrowUp,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  Filter,
  Eye,
} from "lucide-react";
import FeaturedProducts from "@/components/featured-products";
import HeroCarousel from "@/components/hero-carousel";
import HomepageReviews from "@/components/homepage-reviews";
import FlairForwardSection from "@/components/flair-forward-section";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Use the original Navbar component */}

      {/* Add top padding to account for fixed nav if needed */}
      <div className="">
        {/* Hero Section: Enhanced with Modern Banner */}
        <motion.section
          className="relative bg-gradient-to-br from-gray-50 to-white py-12 md:py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Hero Content */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-block bg-pink-100 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  text-sm font-medium">
                  ✨ New Collection Drop
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Fashion That
                  <span
                    className="bg-gradient-to-r 
        from-[#d4af37] 
        via-[#c99700] 
        to-[#b8860b] 
        bg-clip-text 
        text-transparent 
        font-[Raleway] block"
                  >
                    Speaks You
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover the latest trends in fashion with Paribito's curated
                  collection of premium clothing that defines your unique style.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r 
    from-[#d4af37] 
    via-[#c99700] 
    to-[#b8860b] 
    text-white 
    font-[Raleway] 
    hover:from-[#c99700] 
    hover:via-[#b8860b] 
    hover:to-[#a97400] 
    rounded-full 
    px-8 py-3 
    text-lg"
                      asChild
                    >
                      <Link href="/products">
                        Shop Now
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Hero Carousel */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <HeroCarousel />
              </motion.div>
            </div>
          </div>
        </motion.section>
        {/* Flair-Forward Category Section */}
        <FlairForwardSection />

        {/* Enhanced Product Showcase Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-3xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-block bg-pink-100 px-4 py-2 rounded-full text-pink-700 text-sm font-medium mb-4">
                Trending Now
              </div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Featured Products
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                Discover our handpicked selection of premium fashion pieces
              </motion.p>
            </motion.div>

            {/* Enhanced Product Grid Wrapper */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <FeaturedProducts />
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  rounded-full px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  asChild
                >
                  <Link href="/products">
                    View All Products
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Homepage Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HomepageReviews />
        </motion.div>

        {/* Enhanced Instagram Feed Integration */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-3xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-block  px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  text-sm font-medium mb-4">
                @paribito
              </div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Follow Us on Instagram
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                Stay updated with our latest fashion drops, styling tips, and
                behind-the-scenes content
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {[
                { src: "/InstaPost1.webp", alt: "Instagram Post 1" },
                { src: "/InstaPost2.jpg", alt: "Instagram Post 2" },
                { src: "/InstaPost3.jpg", alt: "Instagram Post 3" },
                { src: "/InstaPost4.jpg", alt: "Instagram Post 4" },
              ].map((post, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <a
                    href="https://www.instagram.com/p/CqI13e8SxFT/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={post.src}
                      alt={post.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </a>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm text-gray-900 border-white/40 hover:bg-white rounded-full font-medium"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Post
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  rounded-full px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/theparibito/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Follow on Instagram
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Newsletter Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/800')] opacity-5 bg-cover bg-center"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
                Stay Connected
              </div>
              <motion.h2
                className="text-3xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Join Our Newsletter
              </motion.h2>
              <motion.p
                className="text-xl text-white/80 mb-8"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                Subscribe to receive updates on new collections, exclusive
                offers, and styling tips
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-6 py-3 text-lg backdrop-blur-sm"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  rounded-full px-8 py-3 text-lg font-medium">
                    Subscribe
                  </Button>
                </motion.div>
              </motion.div>
              <motion.p
                className="text-sm text-white/60 mt-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates from Paribito.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
