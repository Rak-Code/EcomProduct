"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, Heart, User, Facebook, Instagram, Youtube, Loader2, MoreVertical, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginModal from "@/components/login-modal";
import RegisterModal from "@/components/register-modal";
import debounce from "lodash/debounce";
import { fetchProducts } from "@/lib/firebase/products";
import type { Product } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartItems = [] } = useCart();
  const { wishlistItems = [] } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce the search to avoid too many requests
  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { products } = await fetchProducts({
        sort: "name-asc"
      });

      // Filter products locally based on search query
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 results

      setSearchResults(filteredProducts);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Handle search input change
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search result click
  const handleSearchResultClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/products/${productId}`);
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSearchResultClick(searchResults[selectedIndex].id);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        break;
    }
  };

  const baseRoutes = [
    {
      href: "/",
      label: "Home",
      active: (pathname ?? "") === "/",
    },
    {
      href: "/products",
      label: "Shop",
      active:
        (pathname ?? "") === "/products" ||
        (pathname ?? "").startsWith("/products/"),
    },
    {
      href: "/collections",
      label: "Collections",
      active: (pathname ?? "") === "/collections",
    },
    // {
    //   href: "/craftsmanship",
    //   label: "Craftsmanship",
    //   active: (pathname ?? "") === "/craftsmanship",
    // },
    {
      href: "/about",
      label: "About",
      active: (pathname ?? "") === "/about",
    },
    {
      href: "/contact",
      label: "Contact",
      active: (pathname ?? "") === "/contact",
    },
  ];

  const adminRoute = {
    href: "/admin",
    label: "Admin",
    active:
      (pathname ?? "") === "/admin" || (pathname ?? "").startsWith("/admin/"),
  };

  const isAdmin = user?.isAdmin;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200 bg-white",
          isScrolled ? "shadow-sm border-b" : ""
        )}
      >
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-2 md:px-4 relative">
          {/* Hamburger menu (always left) */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0 h-8 w-8" aria-label="Open menu">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="relative w-12 h-12 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/logo.jpg"
                    alt="Paribito brand logo in gold hexagon shape"
                    width={48}
                    height={48}
                    className="object-cover mask-hexagon"
                    priority
                  />
                </div>
                <span
                  className="select-none text-[1.5rem] md:text-[2.25rem] font-semibold tracking-wide bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(212,175,55,0.6)] font-[Raleway]"
                  style={{
                    letterSpacing: '0.08em',
                    textTransform: 'capitalize',
                  }}
                >
                  Paribito
                </span>
              </Link>
               <div className="mb-6 pb-4 border-b border-gray-200">
              <p className="text-sm font-medium text-muted-foreground mb-3">Follow Us</p>
              <div className="flex gap-6">
                <a href="https://www.facebook.com/theparibito" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-var(gold-gradient) transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/theparibito/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--gold-gradient)] transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/theparibito/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--gold-gradient)] transition-colors" aria-label="Pinterest">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="h-5 w-5">
                    <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z"/>
                  </svg>
                </a>
                <a href="https://youtube.com/@theparibito4008?si=Mfr61U7XwLY1Ocs_" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--gold-gradient)] transition-colors" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
              <nav className="flex flex-col gap-4">
                {baseRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-base transition-colors hover:text-[var(--gold-gradient)]",
                      route.active
                        ? "text-[var(--gold-gradient)] font-medium"
                        : "text-muted-foreground"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setIsSheetOpen(false);
                      }
                    }}
                  >
                    {route.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href={adminRoute.href}
                    className={cn(
                      "text-base transition-colors hover:text-[var(--gold-gradient)]",
                      adminRoute.active
                        ? "text-[var(--gold-gradient)] font-medium"
                        : "text-muted-foreground"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setIsSheetOpen(false);
                      }
                    }}
                  >
                    {adminRoute.label}
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Brand: logo image + text for all views */}
          <Link
  href="/"
  className="flex-1 flex items-center justify-center md:justify-start z-10"
>
  <div className="flex items-center gap-2">
    <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden flex items-center justify-center">
      <Image
        src="/images/logo.jpg" 
        alt="Paribito brand logo in gold hexagon shape"
        width={48}
        height={48}
        className="object-cover mask-hexagon"
        priority
      />
    </div>
    <span
      className="
        select-none 
        text-[1.5rem] 
        md:text-[2.25rem] 
        font-semibold 
        tracking-wide 
        bg-gradient-to-r 
        from-[#d4af37] 
        via-[#c99700] 
        to-[#b8860b] 
        bg-clip-text 
        text-transparent 
        font-[Raleway]
      "
      style={{
        letterSpacing: '0.08em',
        textTransform: 'capitalize',
      }}
    >
      Paribito
    </span>
  </div>
</Link>



          {/* Desktop nav links (unchanged) */}
          <nav className="hidden md:flex items-center gap-6 ml-auto">
            {baseRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--gold-gradient)] relative group",
                  route.active ? "text-[var(--gold-gradient)]" : "text-foreground"
                )}
              >
                {route.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] transition-all duration-300",
                    route.active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                ></span>
              </Link>
            ))}
            {isAdmin && (
              <Link
                key={adminRoute.href}
                href={adminRoute.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--gold-gradient)] relative group",
                  adminRoute.active ? "text-[var(--gold-gradient)]" : "text-foreground"
                )}
              >
                {adminRoute.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] transition-all duration-300",
                    adminRoute.active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                ></span>
              </Link>
            )}
          </nav>

          {/* Right icons (wishlist, cart, profile) */}
          <div className="flex items-center gap-0.5 md:gap-1 md:ml-8 flex-shrink-0 ml-auto">
            {/* Search */}
            <div
              className={cn(
                "relative",
                isSearchOpen ? "absolute left-0 right-0 top-full bg-[#d4af37] border-t z-50 p-2" : "hidden md:flex"
              )}
            >
              <div className="relative w-full">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full md:w-[120px] lg:w-[180px] border-none bg-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {isSearching && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {searchResults.length > 0 && searchQuery && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 shadow-lg max-h-[300px] overflow-auto">
                    <div className="p-2 space-y-1">
                      {searchResults.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchResultClick(product.id)}
                          className={cn(
                            "w-full text-left px-2 py-1.5 hover:bg-muted rounded-sm flex items-center gap-2 group",
                            index === selectedIndex && "bg-muted"
                          )}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          {product.images?.[0] && (
                            <div className="relative w-8 h-8 overflow-hidden rounded">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium truncate",
                              index === selectedIndex ? "text-[var(--gold-gradient)]" : "group-hover:text-[var(--gold-gradient)]"
                            )}>
                              {product.name}
                            </p>
                            {product.discountPrice ? (
                              <div className="text-sm">
                                <span className="text-green-600">₹{product.discountPrice}</span>
                                <span className="text-gray-400 line-through ml-1">
                                  ₹{product.price}
                                </span>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                ₹{product.price}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 flex-shrink-0"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Main icons */}
            <div className="flex items-center gap-0.5 md:gap-1">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9 flex-shrink-0">
                  <Heart className={cn("h-4 w-4", wishlistItems.length > 0 ? "fill-[#d4af37] text-[#d4af37]" : "")}/>
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#d4af37] text-[12px] md:text-[10px] text-white flex items-center justify-center font-medium">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9 flex-shrink-0">
                  <ShoppingCart className={cn("h-4 w-4", cartItems.length > 0 ? "fill-[#d4af37] text-[#d4af37]" : "")}/>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#d4af37] text-[12px] md:text-[10px] text-white flex items-center justify-center font-medium">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 md:h-9 md:w-9 p-0 flex-shrink-0">
                      <Avatar className="h-6 w-6 md:h-7 md:w-7">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.displayName}
                        />
                        <AvatarFallback>
                          {user.displayName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="w-full">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/orders" className="w-full">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            My Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/wishlist" className="w-full">
                            <Heart className="mr-2 h-4 w-4" />
                            Wishlist
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Admin</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href="/admin" className="w-full">
                                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <line x1="3" y1="9" x2="21" y2="9" />
                                  <line x1="9" y1="21" x2="9" y2="9" />
                                </svg>
                                Dashboard
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/admin/orders" className="w-full">
                                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="9" cy="21" r="1" />
                                  <circle cx="20" cy="21" r="1" />
                                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Manage Orders
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/admin/customers" className="w-full">
                                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Customers
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => setIsLoginModalOpen(true)}>
                          <User className="mr-2 h-4 w-4" />
                          Login
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsRegisterModalOpen(true)}>
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                          </svg>
                          Register
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0"
                >
                  <User className="h-4 w-4" />
                </Button>
              )}
            </div>

   

            {/* Desktop social links */}
            <div className="hidden md:flex items-center border-l border-gray-200 pl-4 ml-2 space-x-3">
              <a href="https://www.facebook.com/theparibito" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--gold-gradient)] transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/theparibito/?igsh=Mm9xanZuc2tqYjNu#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--gold-gradient)] transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/theparibito/?igsh=Mm9xanZuc2tqYjNu#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--gold-gradient)] transition-colors" aria-label="Pinterest">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="h-5 w-5">
                  <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@theparibito4008?si=Mfr61U7XwLY1Ocs_" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--gold-gradient)] transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}
