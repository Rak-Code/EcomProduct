import { Shield, Award, Sparkles, Zap } from "lucide-react"

export default function PremiumFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-premium-gray">
            <div className="h-16 w-16 rounded-full bg-premium-lightBlue flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-premium-blue" />
            </div>
            <h3 className="text-lg font-medium mb-2">Premium Materials</h3>
            <p className="text-muted-foreground">
              Only the finest Grade 1 English willow and premium materials make it into our products.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-premium-gray">
            <div className="h-16 w-16 rounded-full bg-premium-lightBlue flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-premium-blue" />
            </div>
            <h3 className="text-lg font-medium mb-2">Master Craftsmanship</h3>
            <p className="text-muted-foreground">
              Each product is handcrafted by skilled artisans with decades of experience.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-premium-gray">
            <div className="h-16 w-16 rounded-full bg-premium-lightBlue flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-premium-blue" />
            </div>
            <h3 className="text-lg font-medium mb-2">Performance Focused</h3>
            <p className="text-muted-foreground">
              Designed and tested to deliver exceptional performance at all levels of play.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-premium-gray">
            <div className="h-16 w-16 rounded-full bg-premium-lightBlue flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-premium-blue" />
            </div>
            <h3 className="text-lg font-medium mb-2">Lifetime Guarantee</h3>
            <p className="text-muted-foreground">
              We stand behind our quality with a comprehensive warranty on all our products.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
