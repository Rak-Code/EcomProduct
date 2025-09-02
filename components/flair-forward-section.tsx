"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

const collections = [
  {
    title: "Women",
    description: "Elegant pieces for every occasion",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&crop=faces&auto=format&q=80",
    itemCount: "400+ Items",
    href: "/products",
    gradient: "from-rose-400 via-pink-500 to-purple-600",
    hoverGradient: "from-rose-300 via-pink-400 to-purple-500"
  },
  {
    title: "Men", 
    description: "Sophisticated menswear collection",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces&auto=format&q=80",
    itemCount: "250+ Items",
    href: "/products",
    gradient: "from-slate-600 via-blue-700 to-indigo-800",
    hoverGradient: "from-slate-500 via-blue-600 to-indigo-700"
  },
  {
    title: "Kids",
    description: "Playful styles for little ones",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop&crop=center&auto=format&q=80",
    itemCount: "180+ Items",
    href: "/products",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    hoverGradient: "from-emerald-400 via-teal-500 to-cyan-600"
  }
]

const FlairForwardSection = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-semibold rounded-full mb-6 shadow-lg hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Featured Collections</span>
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover Your{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Perfect Style
            </span>
          </motion.h2>
          
          <motion.p
            className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Curated collections designed to elevate your wardrobe with timeless elegance and modern sophistication
          </motion.p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  <motion.img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    whileHover={{ scale: 1.1 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-500`} />
                  
                  {/* Floating Elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-600/20 to-blue-600/30 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-r from-cyan-600/15 to-purple-600/25 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100" />
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <motion.div
                      initial={{ y: 20, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-purple-600/30 rounded-full text-xs font-medium mb-3">
                          {collection.itemCount}
                        </span>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                          {collection.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {collection.description}
                        </p>
                      </div>
                      
                      <Link
                        href={collection.href}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 backdrop-blur-sm rounded-full text-white font-semibold text-sm hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 transform group-hover:scale-105 transition-all duration-300 w-fit shadow-lg"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </motion.div>
                  </div>
                  
                  {/* Hover Border */}
                  <div className="absolute inset-0 border-2 border-purple-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-semibold rounded-full hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/products?featured=true"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-purple-600/30 text-purple-600 font-semibold rounded-full hover:bg-gradient-to-r hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 hover:text-white hover:border-transparent transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Featured Items</span>
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FlairForwardSection