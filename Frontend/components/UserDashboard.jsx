"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UserSweetsList from "./UserSweetsList.jsx"
import CartSummarySheet from "./CartSummarySheet.jsx"
import FloatingCartSummary from "./FloatingCartSummary.jsx"
import { Search, Shield, User, RotateCcw, ShoppingCart, Candy } from "lucide-react"
import Link from "next/link"
import { api } from "../lib/api.js" // Import the API utility
import { useToast } from "@/components/ui/use-toast"

export default function UserDashboard({
  sweets, // Now receiving API-fetched sweets
  shop, // Still needed for in-memory purchase history
  userName,
  onStartNewSession,
  cart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  handleCheckout,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredSweets, setFilteredSweets] = useState(sweets)
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false)
  const [isFloatingCartVisible, setIsFloatingCartVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false) // Loading state for search/filter
  const { toast } = useToast()

  // Update filteredSweets when sweets prop changes (e.g., after initial load or purchase)
  useEffect(() => {
    setFilteredSweets(sweets)
  }, [sweets])

  const categories = [
    "chocolate",
    "candy",
    "pastry",
    "barfi",
    "laddu",
    "halwa",
    "cookie",
    "brownie",
    "fudge",
    "toffee",
    "marzipan",
    "truffle",
    "muffin",
    "cake",
    "tart",
    "brittle",
    "peda",
    "gulab jamun",
  ]

  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    const params = {}
    if (searchQuery) params.name = searchQuery
    if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory

    try {
      const results = await api.searchSweets(params)
      setFilteredSweets(results.map((s) => ({ ...s, id: s._id }))) // Map _id to id
      toast({
        title: "Search Complete",
        description: `${results.length} sweets found.`,
      })
    } catch (error) {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory, toast])

  const handleClearSearch = useCallback(async () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setIsLoading(true)
    try {
      const allSweets = await api.getAllSweets()
      setFilteredSweets(allSweets.map((s) => ({ ...s, id: s._id }))) // Map _id to id
      toast({
        title: "Search Cleared",
        description: "Displaying all sweets.",
      })
    } catch (error) {
      toast({
        title: "Error Clearing Search",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleQuickFilter = useCallback(
    async (category) => {
      setSelectedCategory(category)
      setIsLoading(true)
      try {
        const params = category === "all" ? {} : { category }
        const results = await api.searchSweets(params)
        setFilteredSweets(results.map((s) => ({ ...s, id: s._id }))) // Map _id to id
        toast({
          title: "Filter Applied",
          description: `Filtered by category: ${category === "all" ? "All" : category}.`,
        })
      } catch (error) {
        toast({
          title: "Filter Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const availableSweets = filteredSweets.filter((sweet) => sweet.quantity > 0)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Floating Cart Summary */}
      {isFloatingCartVisible && cart.length > 0 && (
        <FloatingCartSummary
          cart={cart}
          sweets={sweets} // Pass API-fetched sweets
          removeFromCart={removeFromCart}
          updateCartItemQuantity={updateCartItemQuantity}
          onProceedToCheckout={() => setIsCartSheetOpen(true)}
          onClose={() => setIsFloatingCartVisible(false)}
        />
      )}

      {/* Floating "Show Cart" Button */}
      {!isFloatingCartVisible && cart.length > 0 && (
        <div className="fixed top-20 left-4 z-40">
          <Button
            onClick={() => setIsFloatingCartVisible(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-gray-600" />
            <span className="sr-only">Show Cart</span>
            <span className="ml-1 bg-black text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Candy className="w-8 h-8 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-900">The Kata Sweet Shop</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span>
                Welcome, <span className="font-semibold text-gray-700">{userName}</span>!
              </span>
            </div>
            <Button
              onClick={onStartNewSession}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">New Customer</span>
            </Button>
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden md:inline">Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Customer Info Banner */}
        <Card className="mb-8 bg-gray-100 border-gray-300 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-gray-800">Shopping as: {userName}</h3>
                <p className="text-sm text-gray-600">All purchases will be billed to this name.</p>
              </div>
            </div>
            <Button
              onClick={onStartNewSession}
              variant="secondary"
              size="sm"
              className="bg-white/70 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Change Customer
            </Button>
          </CardContent>
        </Card>

        {/* How to Shop Instructions */}
        <Card className="mb-8 bg-gray-100 border-gray-200 shadow-md">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-3">How to Shop:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
              <p className="text-sm">
                <span className="font-bold text-gray-900">Left-click</span> on a sweet card to{" "}
                <span className="font-bold text-gray-900">remove one</span> from your cart.
              </p>
              <p className="text-sm">
                <span className="font-bold text-gray-900">Right-click</span> on a sweet card to{" "}
                <span className="font-bold text-gray-900">add one</span> to your cart.
              </p>
              <p className="text-sm">
                Alternatively, use the <span className="font-bold text-gray-900">"Add to Cart" button</span> below each
                sweet to add one.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filter Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
              <Search className="w-6 h-6 text-gray-600" />
              Find Your Favorite Sweets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sweets by name..."
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="py-2 px-3 text-base"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Select value={selectedCategory} onValueChange={handleQuickFilter} disabled={isLoading}>
                  <SelectTrigger className="py-2 px-3 text-base">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-gray-800 hover:bg-black text-white"
                  disabled={isLoading}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? "Searching..." : "Search"}
                </Button>
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="border-t pt-4 mt-4 border-gray-200">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Quick Filter by Category:</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickFilter("all")}
                  className={selectedCategory === "all" ? "bg-gray-800 text-white hover:bg-black" : ""}
                  disabled={isLoading}
                >
                  All
                </Button>
                {categories.slice(0, 8).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickFilter(category)}
                    className={selectedCategory === category ? "bg-gray-800 text-white hover:bg-black" : ""}
                    disabled={isLoading}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sweets Display */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Available Sweets ({availableSweets.length} items)
          </h2>

          {isLoading ? (
            <Card className="shadow-lg">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading sweets...</p>
              </CardContent>
            </Card>
          ) : availableSweets.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">No sweets available at the moment.</p>
                <p className="text-sm text-gray-400 mt-2">Please check back later or try a different search!</p>
              </CardContent>
            </Card>
          ) : (
            <UserSweetsList
              sweets={availableSweets}
              addToCart={addToCart}
              shop={shop} // Still passing for sweet details
              cart={cart}
              removeFromCart={removeFromCart}
              updateCartItemQuantity={updateCartItemQuantity}
            />
          )}
        </section>

        {/* Shop Info */}
        <Card className="bg-gray-100 border-gray-300 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">About The Kata Sweet Shop</h3>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              We offer the finest collection of traditional Indian sweets and international delicacies. All our sweets
              are made with premium ingredients, traditional recipes, and a whole lot of love. Experience the taste of
              perfection with every bite!
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Cart Summary Sheet (full checkout experience) */}
      <CartSummarySheet
        open={isCartSheetOpen}
        onOpenChange={setIsCartSheetOpen}
        cart={cart}
        sweets={sweets} // Pass API-fetched sweets
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
        onCheckout={handleCheckout}
        customerName={userName}
      />
    </div>
  )
}
