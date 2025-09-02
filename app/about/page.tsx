import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Heart, Shirt, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "About Us | Paribito",
  description: "Discover Paribito's story, our passion for fashion, and commitment to sustainable, stylish clothing",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Paribito</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Where style meets sustainability, and every outfit tells a story
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story – The Birth of Paribito</h2>
          <p className="text-lg mb-4">
            Paribito was born from a simple yet powerful belief: fashion should be accessible, sustainable, and beautifully crafted for everyone.
          </p>
          <p className="text-lg mb-4">
            Our journey began in 2020 when our founder, passionate about ethical fashion, noticed a gap in the market for affordable yet sustainable clothing. What started as a small collection of eco-friendly basics has grown into a full lifestyle brand that celebrates individuality and conscious consumption.
          </p>
          <p className="text-lg mb-4">
            We believe that great style shouldn't come at the cost of our planet. That's why every piece in our collection is thoughtfully designed, ethically sourced, and crafted with materials that respect both our customers and the environment.
          </p>
          <p className="text-lg mb-4">
            From our humble beginnings as an online-only brand, we've grown to serve thousands of customers worldwide, all while maintaining our core values of quality, sustainability, and inclusive fashion.
          </p>
          <p className="text-lg">
            Today, Paribito stands as a testament to the power of conscious fashion – proving that you can look good, feel good, and do good all at the same time.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden">
          <Image
            src="/paribito-store.png?height=600&width=800"
            alt="Paribito fashion collection"
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="mb-16">
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Paribito means "transformation" in Sanskrit – reflecting our mission to transform the fashion industry one conscious choice at a time. We're not just selling clothes; we're building a community of mindful consumers who believe in the power of sustainable style.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join us in reimagining fashion for a better tomorrow.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl h-[400px] rounded-xl overflow-hidden">
            <Image
              src="/InstaPost4.jpg?height=400&width=1200"
              alt="Sustainable fashion production"
              fill
              style={{ objectFit: 'contain', objectPosition: 'center center' }}
              className="rounded-xl bg-gray-50"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <p className="text-lg font-semibold">Manoj Bajpai</p>
              <p>Crafted with care for celebraties</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose Paribito?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're redefining fashion with values that matter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every garment is crafted from the finest sustainable materials and undergoes strict quality control
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ethical Production</h3>
              <p className="text-muted-foreground">
                We partner with fair-trade manufacturers who ensure safe working conditions and fair wages
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shirt className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inclusive Design</h3>
              <p className="text-muted-foreground">
                Our collections celebrate all body types with sizes from XS to 4XL and inclusive styling
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-muted-foreground">
                Free returns within 30 days, excellent customer service, and a lifetime warranty on craftsmanship
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The creative minds and passionate hearts behind Paribito
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Anaya Sharma",
              role: "Founder & Creative Director",
              bio: "Fashion designer with 10+ years experience in sustainable fashion and ethical manufacturing"
            },
            {
              name: "Marcus Chen",
              role: "Head of Sustainability",
              bio: "Environmental expert ensuring every product meets our strict sustainability standards"
            },
            {
              name: "Priya Reddy",
              role: "Customer Experience Lead",
              bio: "Dedicated to making every customer's journey with Paribito exceptional and memorable"
            },
            {
              name: "James Wilson",
              role: "Brand Partnerships",
              bio: "Building relationships with ethical suppliers and sustainable fashion advocates worldwide"
            },
          ].map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="w-full h-64 bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] flex items-center justify-center">
                <Heart className="w-20 h-20 text-white" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b]">{member.name}</h3>
                <p className="text-white text-sm mb-2 bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] inline-block px-2 py-1 rounded">{member.role}</p>
                <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b]">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-12 mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Commitment to Sustainability</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600">
            Every thread tells a story of environmental responsibility. From organic cotton to recycled polyester, 
            we're committed to fashion that doesn't cost the earth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Organic Materials</h3>
              <p className="text-gray-600 text-sm">100% organic cotton and sustainable fabrics in every piece</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Zero Waste</h3>
              <p className="text-gray-600 text-sm">Circular design process that eliminates textile waste</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Carbon Neutral</h3>
              <p className="text-gray-600 text-sm">Offset shipping and production through verified programs</p>
            </div>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " asChild>
            <Link href="/collections">Explore Our Collections</Link>
          </Button>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Visit Our Showroom</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Experience our sustainable fashion collection in person at our eco-friendly showroom in Mumbai
        </p>
        <div className="aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2164946972966!2d72.83333429999999!3d19.054216699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c93e870d1cf7%3A0x56784fa413270537!2sThe%20Paribito!5e0!3m2!1sen!2sin!4v1749820975133!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Wardrobe?</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Discover our collection of sustainable, stylish clothing that makes you look good and feel even better
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400]" asChild>
            <Link href="/collections">Shop Collections</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}