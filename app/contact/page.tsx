"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage({ type: "", text: "" })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })
      if (response.ok) {
        toast({
          title: 'Message sent!',
          description: "We've received your message and will get back to you soon.",
        })
        setStatusMessage({ type: "success", text: "Message sent! We'll get back to you soon." })
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        const data = await response.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to send message. Please try again.',
          variant: 'destructive',
        })
        setStatusMessage({ type: "error", text: data.error || 'Failed to send message. Please try again.' })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
      setStatusMessage({ type: "error", text: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Paribito</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about our sustainable fashion or need styling assistance? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subject} onValueChange={handleSelectChange}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="product">Product Question</SelectItem>
                    <SelectItem value="sizing">Size Guide Help</SelectItem>
                    <SelectItem value="order">Order Status</SelectItem>
                    <SelectItem value="return">Returns & Exchanges</SelectItem>
                    <SelectItem value="sustainability">Sustainability Questions</SelectItem>
                    <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                    <SelectItem value="styling">Personal Styling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us how we can help you..."
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
            {statusMessage.text && (
              <div
                style={{
                  color: statusMessage.type === "success" ? "green" : "red",
                  marginTop: "1rem",
                  textAlign: "center"
                }}
              >
                {statusMessage.text}
              </div>
            )}
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Visit Our Store</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Store Location</h3>
                <p className="text-muted-foreground">
                  First Floor, Mohokar Villa, 69
                  <br />
                  Bazaar Rd, Ranwar, Bandra West
                  <br />
                  Mumbai, Maharashtra 400050
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phone Numbers</h3>
                <p className="text-muted-foreground">
                  Store & Customer Support: 099204 07000
                  <br />
                  WhatsApp Orders: +91 99204 07000
                  <br />
                  Wholesale Inquiries: +91 99204 07001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email Addresses</h3>
                <p className="text-muted-foreground">
                  General Inquiries: info@paribito.com
                  <br />
                  Customer Support: support@paribito.com
                  <br />
                  Wholesale: wholesale@paribito.com
                  <br />
                  Press & Media: press@paribito.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Store Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Saturday: 11:00 AM - 9:00 PM
                  <br />
                  Sunday: 12:00 PM - 8:00 PM
                  <br />
                  Same-day delivery available
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl overflow-hidden">
            <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2164946972966!2d72.83333429999999!3d19.054216699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c93e870d1cf7%3A0x56784fa413270537!2sThe%20Paribito!5e0!3m2!1sen!2sin!4v1749820975133!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">Find quick answers about our sustainable fashion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "What payment methods do you accept?",
              answer:
                "We accept all major credit/debit cards, UPI, net banking, digital wallets, and cash on delivery for orders within India.",
            },
            {
              question: "What is your return and exchange policy?",
              answer:
                "We offer a 30-day return and exchange policy for unused items with original tags. Free returns for defective products.",
            },
            {
              question: "How do I find my correct size?",
              answer:
                "Check our detailed size guide on each product page. We also offer virtual styling consultations to help you find the perfect fit.",
            },
            {
              question: "Do you offer international shipping?",
              answer:
                "Yes, we ship worldwide! International orders typically take 7-15 business days. Shipping costs calculated at checkout.",
            },
            {
              question: "How can I track my order?",
              answer:
                "You'll receive a tracking link via SMS and email once your order ships. You can also track orders in your account dashboard.",
            },
            {
              question: "Are your clothes really sustainable?",
              answer:
                "Yes! We use organic cotton, recycled materials, and partner with ethical manufacturers. Each product page shows our sustainability details.",
            },
            {
              question: "Do you offer same-day delivery?",
              answer:
                "Yes, we offer same-day delivery in Mumbai for orders placed before 2 PM. Express delivery available in other major cities.",
            },
            {
              question: "Can I visit your store for fittings?",
              answer:
                "Absolutely! Visit our Bandra store for personal fittings and styling consultations. We recommend booking an appointment for personalized service.",
            },
          ].map((faq, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Follow Our Fashion Journey</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
          Stay updated with our latest collections, styling tips, sustainability initiatives, and exclusive offers
        </p>
        <div className="flex justify-center gap-4">
          {[
            { name: "Instagram", icon: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z" },
            { name: "Facebook", icon: "M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
            {
              name: "Pinterest",
              icon: "M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z",
            },
            {
              name: "YouTube",
              icon: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z",
            },
          ].map((social, index) => (
            <Link
              key={index}
              href="https://www.instagram.com/p/CqI13e8SxFT/?hl=en"
              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
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
                className="h-5 w-5 text-primary"
              >
                <path d={social.icon}></path>
              </svg>
              <span className="sr-only">{social.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}