"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, Heart, CreditCard, MapPin, Bell, Lock, LogOut, Loader2, Star } from "lucide-react"
import { getAuth, updateProfile } from "firebase/auth"
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore" // Import Firestore functions
import { getUserOrders } from "@/lib/firebase/orders"

export default function ProfilePage() {
  const { user, logout, updateUserContext } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Profile form state
  const [name, setName] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("")

  // Address form state
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Home",
      address: "Bandra",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
      isDefault: true,
    },
  ])

  // User orders state
  const [userOrders, setUserOrders] = useState<any[]>([])

  // Fetch user data from Firestore when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const db = getFirestore();
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.phone) {
              setPhone(userData.phone);
            }
          }
          // Fetch user orders from Firestore
          const orders = await getUserOrders(user.uid)
          console.log("Fetched orders for user", user.uid, orders); // DEBUG LOG
          setUserOrders(orders)
        } catch (error) {
          console.error("Error fetching user data or orders:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (!user) {
    router.push("/")
    return null
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const authInstance = getAuth();
      const db = getFirestore(); // Get the Firestore instance

      if (authInstance.currentUser) {
        const userUid = authInstance.currentUser.uid;
        const userDocRef = doc(db, "users", userUid); // Reference to the user document in Firestore

        // Update the user's display name in Firebase Authentication
        await updateProfile(authInstance.currentUser, {
          displayName: name,
        });

        // Update the user's name and phone number in Firestore
        await updateDoc(userDocRef, {
          name: name, // Update the name in Firestore
          phone: phone, // Update the phone number in Firestore
        });

        // Update the user object in your auth context
        updateUserContext({ displayName: name });

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "No user is currently logged in.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderOrdersTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center"><Package className="mr-2 h-5 w-5" /> My Orders</h2>
      {userOrders.length === 0 ? (
        <div className="text-muted-foreground">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Order ID</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Total</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 border-b">{order.id}</td>
                  <td className="px-4 py-2 border-b">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2 border-b">{order.status || "-"}</td>
                  <td className="px-4 py-2 border-b">₹{order.total?.toFixed(2)}</td>
                  <td className="px-4 py-2 border-b">
                    <Link href={`/orders/${order.id}`} className="text-primary underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="sticky top-20">
            <div className="flex flex-col items-center mb-6 p-6 border rounded-xl">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName} />
                <AvatarFallback className="text-xl">{user.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <div className="w-full">
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "profile" ? "bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "orders" ? "bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "addresses" ? "bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Addresses
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "wishlist" ? "bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "payment" ? "bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "reviews" ? "bg-pink-600 text-white hover:bg-pink-700" : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  <Star className="mr-2 h-4 w-4" />
                  My Reviews
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "notifications" ? "bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${activeTab === "security" ? "bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white "  : "hover:bg-pink-50"}`}
                  onClick={() => setActiveTab("security")}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="md:w-3/4">
          {activeTab === "profile" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4">
                <h2 className="font-semibold">Personal Information</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>

                  <Button type="submit" className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "orders" && renderOrdersTab()}

          {activeTab === "addresses" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4 flex justify-between items-center">
                <h2 className="font-semibold">Saved Addresses</h2>
                <Button className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " size="sm">Add New Address</Button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          Default
                        </span>
                      )}
                      <h3 className="font-semibold">{address.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {address.address}
                        <br />
                        {address.city}, {address.state} {address.postalCode}
                        <br />
                        {address.country}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4">
                <h2 className="font-semibold">Wishlist</h2>
              </div>
              <div className="p-6">
                <Button className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " asChild>
                  <Link href="/wishlist">View My Wishlist</Link>
                </Button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4 flex justify-between items-center">
                <h2 className="font-semibold">Payment Methods</h2>
                <Button className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white " size="sm">Add Payment Method</Button>
              </div>
              <div className="p-6">
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Visa ending in 4242</h3>
                      <p className="text-sm text-muted-foreground">Expires 04/25</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4">
                <h2 className="font-semibold">My Reviews</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">Pro Master English Willow Bat</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Reviewed on April 15, 2023</p>
                    <p className="text-sm">
                      This bat is amazing! Perfect balance and great pickup. I've been using it for a month now and it's
                      already helped me improve my game.
                    </p>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/products/1">View Product</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Review
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">Professional Batting Pads</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Reviewed on April 2, 2023</p>
                    <p className="text-sm">
                      Great protection and comfortable fit. The only reason I'm giving 4 stars is that they're slightly
                      heavier than expected.
                    </p>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/products/5">View Product</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4">
                <h2 className="font-semibold">Notification Preferences</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Order Updates</h3>
                    <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Promotions</h3>
                    <p className="text-sm text-muted-foreground">Receive promotions and offers</p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Newsletter</h3>
                    <p className="text-sm text-muted-foreground">Receive our weekly newsletter</p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Disabled
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4">
                <h2 className="font-semibold">Security Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white  hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] text-white ">Update Password</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
