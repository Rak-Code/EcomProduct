import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="relative w-12 h-12 overflow-hidden rounded-lg flex items-center justify-center bg-gray-50">
                <Image
                  src="/images/ParibotoLogo.png"
                  alt="Pariboto"
                  width={40}
                  height={40}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="font-semibold text-2xl text-gray-900 tracking-tight">Paribito</span>
            </Link>
            <p className="text-gray-600 leading-relaxed mb-8 text-sm">
              Timeless fashion with a modern edge. Paribito crafts premium apparel that blends comfort, style, and quality—made for every body and every story.
            </p>
            <div className="flex space-x-5">
              <a href="https://www.facebook.com/theparibito" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-all duration-200 hover:scale-110">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.instagram.com/theparibito/?igsh=Mm9xanZuc2tqYjNu#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-all duration-200 hover:scale-110">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://www.facebook.com/theparibito" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-all duration-200 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="h-5 w-5">
                  <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z"/>
                </svg>
                <span className="sr-only">Pinterest</span>
              </a>
              <a href="https://youtube.com/@theparibito4008?si=Mfr61U7XwLY1Ocs_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-all duration-200 hover:scale-110">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-6 text-gray-900 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Home</Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Shop</Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Collections</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-6 text-gray-900 uppercase tracking-wide">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                <span className="text-gray-600 text-sm leading-relaxed">First Floor, Mohokar Villa, 69, Bazaar Rd, Ranwar, Bandra West, Mumbai, Maharashtra 400050</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">099204 07000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href="mailto:support@paribito.com" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">support@paribito.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-6 text-gray-900 uppercase tracking-wide">Newsletter</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Join our list for exclusive drops, styling tips, and limited-time deals.</p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-gray-400 bg-white"
              />
              <Button className="w-full bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white  transition-colors duration-200 py-3 text-sm font-medium rounded-md border-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Paribito. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Terms of Service
            </Link>
            <Link href="/shipping-policy" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
