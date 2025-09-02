"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { signIn } from "@/lib/firebase/auth"
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onRegisterClick: () => void
}

export default function LoginModal({ isOpen, onClose, onRegisterClick }: LoginModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn(email, password)
      const user = result.user
      
      if (user) {
        const idToken = await user.getIdToken();
        const { setCookie } = await import("cookies-next");
        setCookie("token", idToken, { path: "/" });
      }
      
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })
      onClose()

      // Check if the email is the admin email
      if (email.toLowerCase() === "samadali1580@gmail.com") {
        // Update user's isAdmin flag in Firestore if needed
        const db = getFirestore()
        const userDocRef = doc(db, "users", user.uid)
        
        // Check if user document exists
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          // Update the isAdmin field
          await updateDoc(userDocRef, {
            isAdmin: true
          })
        }
        
        // Redirect to admin dashboard
        window.location.href = "/admin"
      } else {
        // Redirect regular users to home page
        window.location.href = "/"
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome Back</DialogTitle>
          <DialogDescription>Login to your account to continue shopping</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input className="border-[var(--gold-gradient)] focus:border-[var(--gold-gradient)] focus:ring-[var(--gold-gradient)]"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" size="sm" className="p-0 h-auto text-xs bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] bg-clip-text text-transparent hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400]" onClick={() => alert("Forgot password functionality not implemented yet")}> 
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Input className="border-[var(--gold-gradient)] focus:border-[var(--gold-gradient)] focus:ring-[var(--gold-gradient)]"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400]" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button variant="link" className="p-0 h-auto bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] bg-clip-text text-transparent hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400]" onClick={onRegisterClick}>
                Register
              </Button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
