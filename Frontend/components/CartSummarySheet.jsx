"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ShoppingCart, AlertTriangle, CheckCircle, Receipt, User, Plus, Minus, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"

export default function CartSummarySheet({
  open,
  onOpenChange,
  cart,
  sweets, // Now receiving API-fetched sweets
  removeFromCart,
  updateCartItemQuantity,
  onCheckout,
  customerName,
}) {
  const [error, setError] = useState("")
  const [checkoutResult, setCheckoutResult] = useState(null)
  const [cartDetails, setCartDetails] = useState([])
  const [localQuantities, setLocalQuantities] = useState({}) // Local state for input fields

  useEffect(() => {
    const details = cart
      .map((item) => {
        const sweet = sweets.find((s) => s.id === item.sweetId) // Use 'sweets' prop
        return sweet ? { ...sweet, quantityInCart: item.quantity } : null
      })
      .filter(Boolean)
    setCartDetails(details)
    // Initialize local quantities from cart details
    setLocalQuantities(details.reduce((acc, item) => ({ ...acc, [item.id]: item.quantityInCart }), {}))
  }, [cart, sweets]) // Depend on 'sweets' instead of 'shop'

  const handleCheckout = async () => {
    setError("")
    if (cart.length === 0) {
      setError("Your cart is empty!")
      return
    }
    // Re-check for stock issues before checkout using current local quantities
    const currentHasStockIssues = cartDetails.some((item) => localQuantities[item.id] > item.quantity)
    if (currentHasStockIssues) {
      setError("Cannot proceed: Some items exceed available stock. Please adjust quantities.")
      return
    }

    try {
      const result = await onCheckout()
      setCheckoutResult(result)
    } catch (error) {
      setError(error.message)
    }
  }

  const totalCartValue = cartDetails.reduce((total, item) => total + item.price * localQuantities[item.id], 0)

  // Check for stock issues based on local quantities
  const hasStockIssues = cartDetails.some((item) => localQuantities[item.id] > item.quantity)

  const handleLocalQuantityChange = (itemId, e) => {
    let newValue = Number.parseInt(e.target.value)
    if (isNaN(newValue) || newValue < 1) {
      newValue = 1 // Default to 1 if invalid or less than 1
    }
    const item = cartDetails.find((i) => i.id === itemId)
    if (newValue > item.quantity) {
      newValue = item.quantity // Clamp to available stock
    }
    setLocalQuantities((prev) => ({ ...prev, [itemId]: newValue }))
    updateCartItemQuantity(itemId, newValue) // Update the actual cart state
  }

  if (checkoutResult) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-full sm:max-w-sm flex flex-col bg-gray-50">
          <SheetHeader className="pb-4 border-b border-gray-200">
            <div className="flex justify-center mb-3">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
            <SheetTitle className="text-green-700 text-center text-2xl font-bold">Purchase Successful!</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Receipt */}
            <Card className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg shadow-inner">
              <div className="text-center mb-4">
                <h3 className="font-bold text-xl text-gray-900">The Kata Sweet Shop</h3>
                <p className="text-sm text-gray-600">Official Purchase Receipt</p>
                <p className="text-xs text-gray-500 mt-1">Transaction ID: #{checkoutResult.transactionId}</p>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span className="font-medium">Customer:</span>
                  <span className="text-gray-800 font-semibold">{customerName}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span className="font-medium">Date:</span>
                  <span>{new Date(checkoutResult.purchaseDate).toLocaleString()}</span>
                </div>
                <h4 className="font-bold text-md text-gray-800 mt-4 mb-2">Items Purchased:</h4>
                {checkoutResult.purchasedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm pl-2 py-1 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-700">
                      {item.sweetName} (<span className="font-medium">{item.quantityPurchased}x</span>)
                    </span>
                    <span className="font-semibold text-gray-800">₹{item.itemTotalCost.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total Amount:</span>
                    <span className="text-green-700">₹{checkoutResult.totalTransactionCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>Thank you for shopping with us!</p>
                  <p>We hope to see you again soon.</p>
                </div>
              </div>
            </Card>
          </div>
          <SheetFooter className="p-4 border-t border-gray-200">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gray-800 hover:bg-black text-white font-semibold"
            >
              Continue Shopping
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-sm flex flex-col bg-gray-50">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <SheetTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <ShoppingCart className="w-6 h-6" />
            Your Shopping Cart
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-gray-500" />
            <span>
              Billing to: <span className="font-semibold text-gray-700">{customerName}</span>
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartDetails.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-lg">
              <p>Your cart is empty.</p>
              <p className="text-sm mt-2">Start adding some delicious sweets!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartDetails.map((item) => {
                const localQuantity = localQuantities[item.id] || item.quantityInCart

                return (
                  <Card key={item.id} className="p-3 shadow-sm border border-gray-100 bg-white/80">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} / unit</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateCartItemQuantity(item.id, localQuantity - 1)}
                          disabled={localQuantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={String(localQuantity)} // Use local state
                          onChange={(e) => handleLocalQuantityChange(item.id, e)} // Use local handler
                          className="w-14 h-8 text-center text-sm border-gray-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateCartItemQuantity(item.id, localQuantity + 1)}
                          disabled={localQuantity >= item.quantity}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-bold text-lg text-gray-900">₹{(item.price * localQuantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          <Card className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-gray-800">Total Cart Value:</span>
              <span className="text-3xl font-bold text-gray-900">₹{totalCartValue.toFixed(2)}</span>
            </div>
          </Card>

          {(error || hasStockIssues) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {error || "Some items exceed available stock. Please adjust quantities."}
              </span>
            </div>
          )}
        </div>
        <SheetFooter className="p-4 flex flex-col gap-3 border-t border-gray-200">
          <Button
            onClick={handleCheckout}
            className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-3 text-lg"
            disabled={cart.length === 0 || hasStockIssues}
          >
            <Receipt className="w-5 h-5 mr-2" />
            Proceed to Checkout
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full bg-white/70 border border-gray-200 text-gray-700 hover:bg-gray-100 py-3 text-lg"
          >
            Close Cart
          </Button>
        </SheetFooter>
      </SheetContent>
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield; /* Firefox */
        }
      `}</style>
    </Sheet>
  )
}
