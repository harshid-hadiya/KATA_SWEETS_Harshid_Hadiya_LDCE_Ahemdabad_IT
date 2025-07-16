"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Candy } from "lucide-react" // Import Candy icon for placeholder

export default function UserSweetsList({ sweets, addToCart, cart, removeFromCart, updateCartItemQuantity }) {
  const { toast } = useToast()

  const handleCardLeftClick = (sweetId) => {
    const cartItem = cart.find((item) => item.sweetId === sweetId)
    if (cartItem && cartItem.quantity > 0) {
      const newQuantity = cartItem.quantity - 1
      updateCartItemQuantity(sweetId, newQuantity)
      toast({
        title: "Item Removed",
        description: `Removed 1 unit of ${sweets.find((s) => s.id === sweetId)?.name || "item"} from cart.`,
        duration: 2000,
      })
    } else if (cartItem && cartItem.quantity === 0) {
      removeFromCart(sweetId)
      toast({
        title: "Item Removed",
        description: `${sweets.find((s) => s.id === sweetId)?.name || "Item"} removed from cart.`,
        duration: 2000,
      })
    } else {
      toast({
        title: "Not in Cart",
        description: `${sweets.find((s) => s.id === sweetId)?.name || "Item"} is not in your cart to remove.`,
        duration: 2000,
        variant: "destructive",
      })
    }
  }

  const handleCardRightClick = (e, sweetId) => {
    e.preventDefault() // Prevent default browser context menu
    const sweet = sweets.find((s) => s.id === sweetId)
    const cartItem = cart.find((item) => item.sweetId === sweetId)
    const currentQuantityInCart = cartItem ? cartItem.quantity : 0

    if (currentQuantityInCart < sweet.quantity) {
      try {
        addToCart(sweetId, 1) // Add one more
      } catch (error) {
        toast({
          title: "Failed to Add",
          description: error.message,
          duration: 3000,
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Stock Limit Reached",
        description: `Cannot add more ${sweet.name}. Maximum stock reached.`,
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  const handleAddToCartButton = (sweetId) => {
    try {
      addToCart(sweetId, 1) // Always add 1 when the "Add to Cart" button is clicked
    } catch (error) {
      toast({
        title: "Failed to Add",
        description: error.message,
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (category) => {
    // Using a consistent gray for all categories in B&W theme
    return "bg-gray-200 text-gray-800"
  }

  const getStockStatus = (quantity) => {
    if (quantity > 10) return { text: "In Stock", color: "text-green-600" }
    if (quantity > 5) return { text: "Limited Stock", color: "text-yellow-600" }
    if (quantity > 0) return { text: "Few Left", color: "text-orange-600" }
    return { text: "Out of Stock", color: "text-red-600" }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sweets.map((sweet) => {
        const stockStatus = getStockStatus(sweet.quantity)
        const cartItem = cart.find((item) => item.sweetId === sweet.id)
        const quantityInCart = cartItem ? cartItem.quantity : 0

        const isAddToCartButtonDisabled = sweet.quantity === 0 || quantityInCart >= sweet.quantity

        return (
          <Card
            key={sweet.id}
            className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-200 bg-white"
            onClick={() => handleCardLeftClick(sweet.id)}
            onContextMenu={(e) => handleCardRightClick(e, sweet.id)}
          >
            {/* Optional: Placeholder for sweet image/icon */}
            <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-500 text-5xl">
              <Candy className="w-16 h-16 opacity-70" />
            </div>

            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 mb-1">{sweet.name}</CardTitle>
                  <Badge className={`${getCategoryColor(sweet.category)} text-xs px-2 py-1 rounded-full`}>
                    {sweet.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900">₹{sweet.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">per piece</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.text}</p>
                  <p className="text-xs text-gray-500">{sweet.quantity} available</p>
                </div>
              </div>

              {/* Quantity in Cart Display */}
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gray-100 text-gray-700 font-semibold text-base">
                <ShoppingCart className="w-4 h-4" />
                {quantityInCart > 0 ? `${quantityInCart} in cart` : "Not in cart"}
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation() // Prevent card's onClick/onContextMenu from firing
                  handleAddToCartButton(sweet.id)
                }}
                disabled={isAddToCartButtonDisabled}
                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-lg transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                {sweet.quantity === 0 ? "Out of Stock" : quantityInCart > 0 ? `Add One More` : "Add to Cart"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
