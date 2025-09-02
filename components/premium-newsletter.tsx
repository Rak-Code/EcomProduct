"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Mail } from "lucide-react"

export default function PremiumNewsletter() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing",
        description: "You've been added to our newsletter list.",
      })
      setEmail("")
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="py-20 bg-premium-blue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Join Our Community</h2>
          <p className="text-white/80 mb-8">
            Subscribe to receive exclusive offers, early access to limited editions, and expert cricket insights.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-white text-premium-blue hover:bg-white/90 rounded-full"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
