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
  Sparkles,
  TrendingUp,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Animated background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(0,0,0,0.8),rgba(17,24,39,0.9),rgba(0,0,0,0.8))]" />
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-600/20 to-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section: Enhanced with Modern Dark Banner */}
        <motion.section
          className="relative bg-transparent py-16 md:py-24 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 gap-12 items-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Hero Content */}
              <motion.div
                className="space-y-8"
                variants={itemVariants}
              >
                <motion.div 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-md border border-gray-600/30 px-6 py-3 rounded-full text-gray-100 text-sm font-medium shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  New Collection Drop
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold text-white leading-tight"
                  variants={itemVariants}
                >
                  Fashion That
                  <motion.span
                    className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-[Inter] block mt-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  >
                    Defines You
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-300 leading-relaxed max-w-lg"
                  variants={itemVariants}
                >
                  Discover the latest trends in fashion with Athena's curated collection of premium clothing that speaks to your unique identity.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 rounded-full px-10 py-4 text-lg shadow-2xl border-0 transition-all duration-300"
                      asChild
                    >
                      <Link href="/products" className="group">
                        Shop Now
                        <motion.div
                          className="ml-2 inline-block"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-gray-600 text-gray-100 hover:bg-gray-800 hover:text-white rounded-full px-10 py-4 text-lg backdrop-blur-md bg-gray-900/50 transition-all duration-300"
                      asChild
                    >
                      <Link href="/about">
                        Learn More
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Hero Carousel */}
              <motion.div
                className="relative"
                variants={itemVariants}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl transform rotate-6"></div>
                <div className="relative bg-gray-800/30 backdrop-blur-md border border-gray-600/30 rounded-3xl p-4 shadow-2xl">
                  <HeroCarousel />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Flair-Forward Category Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <FlairForwardSection />
        </motion.div>

        {/* Enhanced Product Showcase Section */}
        <section className="py-24 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1),transparent_70%)]"></div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-md border border-gray-600/30 px-6 py-3 rounded-full text-gray-100 text-sm font-medium mb-6 shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Trending Now
              </motion.div>
              
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Featured Products
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                Discover our handpicked selection of premium fashion pieces crafted for the modern individual
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-gray-900/30 backdrop-blur-md border border-gray-700/30 rounded-3xl p-8 shadow-2xl">
                <FeaturedProducts />
              </div>
            </motion.div>

            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 rounded-full px-12 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                  size="lg"
                  asChild
                >
                  <Link href="/products" className="group">
                    View All Products
                    <motion.div
                      className="ml-2 inline-block"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
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
        <section className="py-24 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-md border border-gray-600/30 px-6 py-3 rounded-full text-gray-100 text-sm font-medium mb-6 shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                @athena
              </motion.div>
              
              <motion.h2
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Follow Us on Instagram
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                Stay updated with our latest fashion drops, styling tips, and behind-the-scenes content
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
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
                  className="relative aspect-square overflow-hidden rounded-3xl group cursor-pointer shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  
                  <div className="relative bg-gray-800/30 backdrop-blur-md border border-gray-600/30 rounded-3xl overflow-hidden h-full shadow-2xl">
                    <a
                      href="https://www.instagram.com/p/CqI13e8SxFT/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={post.src}
                        alt={post.alt}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    </a>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 rounded-full font-medium shadow-xl"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Post
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 rounded-full px-12 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                  size="lg"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/theparibito/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    Follow on Instagram
                    <motion.div
                      className="ml-2 inline-block"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Newsletter Section */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(0,0,0,0.9),rgba(17,24,39,0.95),rgba(0,0,0,0.9))]"></div>
          
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-cyan-600/30 to-indigo-600/30 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white/90 text-sm font-medium mb-8 shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                Stay Connected
              </motion.div>
              
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Join Our Newsletter
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                Subscribe to receive updates on new collections, exclusive offers, and styling tips curated just for you
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white/5 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 rounded-full px-6 py-4 text-lg shadow-xl focus:bg-white/10 focus:border-purple-400 transition-all duration-300"
                  />
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 rounded-full px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                    Subscribe
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.p
                className="text-sm text-gray-400 max-w-md mx-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                By subscribing, you agree to our Privacy Policy and consent to receive updates from Athena.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}