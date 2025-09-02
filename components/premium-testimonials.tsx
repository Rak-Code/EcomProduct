import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Professional Cricketer",
    content:
      "The craftsmanship of these bats is exceptional. The perfect balance and pickup have transformed my game completely. I've never felt more confident at the crease.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Cricket Coach",
    content:
      "I recommend these bats to all my serious students. The quality is unmatched, and the customer service is outstanding. The attention to detail in every aspect is remarkable.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Arjun Singh",
    role: "Club Cricketer",
    content:
      "As a club player, I was looking for professional quality without the professional price tag. This bat delivers exceptional performance and has elevated my game significantly.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

export default function PremiumTestimonials() {
  return (
    <section className="py-20 bg-premium-beige">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg">
            Trusted by cricket players at all levels, from international professionals to weekend enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-none shadow-premium hover:shadow-premium-hover transition-all duration-300 bg-white"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "fill-premium-gold text-premium-gold" : "text-gray-300"}`}
                      />
                    ))}
                </div>
                <p className="mb-8 text-premium-charcoal italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
