"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, AlertTriangle, CheckCircle, Receipt, User } from "lucide-react"

export default function PurchaseModal({ sweet, onPurchase, onClose, customerName }) {
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState("")
  const [purchaseResult, setPurchaseResult] = useState(null)

  const handlePurchase = async () => {
    // Made async to await onPurchase
    setError("")

    if (quantity <= 0) {
      setError("Quantity must be greater than 0")
      return
    }

    if (quantity > sweet.quantity) {
      setError(`Only ${sweet.quantity} units available`)
      return
    }

    try {
      const result = await onPurchase(sweet.id, quantity) // Await the purchase
      setPurchaseResult(result) // Set the result to display the bill
    } catch (error) {
      setError(error.message)
    }
  }

  const totalCost = sweet.price * quantity

  if (purchaseResult) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <CardTitle className="text-green-700">Purchase Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Receipt */}
          <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <div className="text-center mb-3">
              <h3 className="font-bold text-lg">The Kata Sweet Shop</h3>
              <p className="text-sm text-gray-600">Purchase Receipt</p>
              <p className="text-xs text-gray-500">#{purchaseResult.purchaseId}</p>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span className="text-pink-600 font-medium">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Item:</span>
                <span>{purchaseResult.sweetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Quantity:</span>
                <span>{purchaseResult.quantityPurchased} units</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Unit Price:</span>
                <span>₹{sweet.price.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-gray-300 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-700">₹{purchaseResult.totalCost.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-3">
                <p>Thank you for shopping with us!</p>
                <p>Date: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Remaining Stock:</span>
              <span>{purchaseResult.remainingStock} units</span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Purchase Sweet
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>
            Billing to: <span className="font-medium text-pink-600">{customerName}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">{sweet.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-blue-100 text-blue-800">{sweet.category}</Badge>
            <span className="text-sm text-gray-600">₹{sweet.price.toFixed(2)} per unit</span>
          </div>
          <div className="mt-2">
            <span className={`text-sm ${sweet.quantity < 5 ? "text-red-600" : "text-green-600"}`}>
              {sweet.quantity} units in stock
              {sweet.quantity < 5 && sweet.quantity > 0 && " (Low Stock)"}
              {sweet.quantity === 0 && " (Out of Stock)"}
            </span>
          </div>
        </div>

        {sweet.quantity === 0 ? (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span>This item is currently out of stock</span>
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="quantity">Quantity to Purchase</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={sweet.quantity}
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number.parseInt(e.target.value) || 1)
                  setError("")
                }}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum available: {sweet.quantity} units</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost:</span>
                <span className="text-xl font-bold text-blue-700">₹{totalCost.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handlePurchase} className="flex-1">
                <Receipt className="w-4 h-4 mr-2" />
                Purchase & Generate Bill
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
