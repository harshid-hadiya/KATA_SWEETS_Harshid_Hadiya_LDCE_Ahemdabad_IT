"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Plus, Minus, Trash2, Receipt, X, AlertTriangle } from "lucide-react"

export default function FloatingCartSummary({
  cart,
  sweets, // Now receiving API-fetched sweets
  removeFromCart,
  updateCartItemQuantity,
  onProceedToCheckout,
  onClose,
}) {
  const [cartDetails, setCartDetails] = useState([])
  const [localQuantities, setLocalQuantities] = useState({})

  useEffect(() => {
    const details = cart
      .map((item) => {
        const sweet = sweets.find((s) => s.id === item.sweetId) // Use 'sweets' prop
        return sweet ? { ...sweet, quantityInCart: item.quantity } : null
      })
      .filter(Boolean)
    setCartDetails(details)
    setLocalQuantities(details.reduce((acc, item) => ({ ...acc, [item.id]: item.quantityInCart }), {}))
  }, [cart, sweets]) // Depend on 'sweets' instead of 'shop'

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0)
  const totalCartValue = cartDetails.reduce((total, item) => total + item.price * localQuantities[item.id], 0)

  // Check for stock issues
  const hasStockIssues = cartDetails.some((item) => localQuantities[item.id] > item.quantity)

  if (cartDetails.length === 0) {
    return null
  }

  const handleLocalQuantityChange = (itemId, newValue) => {
    if (isNaN(newValue) || newValue < 1) {
      newValue = 1 // Default to 1 if invalid or less than 1
    }
    const item = cartDetails.find((i) => i.id === itemId)
    if (newValue > item.quantity) {
      newValue = item.quantity // Clamp to available stock
    }
    setLocalQuantities((prev) => ({ ...prev, [itemId]: newValue }))
    updateCartItemQuantity(itemId, newValue)
  }

  return (
    <Card className="fixed top-4 left-4 z-50 w-80 shadow-2xl bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl animate-fade-in-left">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
          <ShoppingCart className="w-5 h-5" />
          Your Cart ({totalCartItems})
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
          <span className="sr-only">Close cart</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {hasStockIssues && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Some items exceed available stock. Please adjust quantities.</span>
          </div>
        )}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {cartDetails.map((item) => {
            const localQuantity = localQuantities[item.id] || item.quantityInCart

            return (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex-1 pr-2">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-xs text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-600 hover:bg-gray-100"
                    onClick={() => handleLocalQuantityChange(item.id, localQuantity - 1)}
                    disabled={localQuantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={String(localQuantity)} // Use local state
                    onChange={(e) => handleLocalQuantityChange(item.id, Number.parseInt(e.target.value))} // Use local handler
                    className="w-10 h-6 text-center text-sm border-gray-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-600 hover:bg-gray-100"
                    onClick={() => handleLocalQuantityChange(item.id, localQuantity + 1)}
                    disabled={localQuantity >= item.quantity}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="ml-2 text-right">
                  <p className="font-semibold text-gray-900">₹{(item.price * localQuantity).toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-lg text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-gray-900">₹{totalCartValue.toFixed(2)}</span>
          </div>
          <Button
            onClick={onProceedToCheckout}
            className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-lg transition-colors duration-200"
            disabled={cart.length === 0 || hasStockIssues} // Disable if stock issues
          >
            <Receipt className="w-4 h-4 mr-2" />
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0; /* Light gray */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888; /* Medium gray */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555; /* Darker gray */
        }
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.3s ease-out forwards;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield; /* Firefox */
        }
      `}</style>
    </Card>
  )
}
