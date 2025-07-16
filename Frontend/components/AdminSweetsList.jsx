"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Package, Edit2, Check, X, Candy } from "lucide-react" // Import Candy icon for placeholder
import { useToast } from "@/components/ui/use-toast"

export default function AdminSweetsList({ sweets, onDeleteSweet, onRestockSweet }) {
  const [restockQuantities, setRestockQuantities] = useState({})
  const [editingSweet, setEditingSweet] = useState(null)
  const [editForm, setEditForm] = useState({}) // Only for quantity if general update is removed
  const [errors, setErrors] = useState({})
  const { toast } = useToast()

  const handleRestock = async (sweetId) => {
    const quantity = Number.parseInt(restockQuantities[sweetId] || 0) // Default to 0 if empty
    if (quantity <= 0 || isNaN(quantity)) {
      setErrors((prev) => ({ ...prev, [sweetId]: "Restock quantity must be a positive number" }))
      return
    }
    try {
      await onRestockSweet(sweetId, quantity)
      setRestockQuantities((prev) => ({ ...prev, [sweetId]: "" }))
      setErrors((prev) => ({ ...prev, [sweetId]: "" }))
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sweetId]: error.message }))
      toast({
        title: "Restock Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // NOTE: General sweet update (name, category, price) is NOT supported by the provided API.
  // The UI for editing these fields is removed. Only restock is available.
  const startEditing = (sweet) => {
    setEditingSweet(sweet.id)
    setEditForm({
      quantity: sweet.quantity.toString(), // Only quantity is editable via API
    })
  }

  const cancelEditing = () => {
    setEditingSweet(null)
    setEditForm({})
    setErrors({})
  }

  const saveEdit = async (sweetId) => {
    try {
      const quantityUpdate = Number.parseInt(editForm.quantity)
      if (isNaN(quantityUpdate) || quantityUpdate < 0) {
        setErrors((prev) => ({ ...prev, [sweetId]: "Quantity must be a non-negative number" }))
        return
      }

      // Calculate the difference to send to restock API
      const currentSweet = sweets.find((s) => s.id === sweetId)
      const quantityDifference = quantityUpdate - currentSweet.quantity

      if (quantityDifference > 0) {
        await onRestockSweet(sweetId, quantityDifference)
      } else if (quantityDifference < 0) {
        // If quantity is reduced, this implies a manual adjustment, not a restock.
        // The API doesn't support reducing stock directly via 'restock'.
        // This would require a separate 'update' or 'adjust stock' endpoint.
        // For now, we'll prevent reducing stock via this edit button.
        setErrors((prev) => ({
          ...prev,
          [sweetId]: "Cannot reduce stock directly here. Only increasing stock is allowed.",
        }))
        toast({
          title: "Stock Adjustment Error",
          description: "Reducing stock is not supported via this edit function. Only increasing stock is allowed.",
          variant: "destructive",
        })
        return
      }

      setEditingSweet(null)
      setEditForm({})
      setErrors({})
      toast({
        title: "Sweet Updated",
        description: "Sweet quantity has been updated.",
      })
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sweetId]: error.message }))
      toast({
        title: "Update Failed",
        description: error.message,
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

  if (sweets.length === 0) {
    return (
      <Card className="w-full shadow-lg border border-gray-200 bg-white">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No sweets found. Add some sweets to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sweets.map((sweet) => {
          const stockStatus = getStockStatus(sweet.quantity)
          return (
            <Card
              key={sweet.id}
              className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white"
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

                {editingSweet === sweet.id ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, quantity: e.target.value }))}
                      className="w-24 h-9 text-center text-base border-gray-300"
                    />
                    <Button
                      size="sm"
                      onClick={() => saveEdit(sweet.id)}
                      className="flex-1 bg-gray-800 hover:bg-black text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing} className="flex-1 bg-transparent">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(sweet)}
                      className="flex-1 bg-white/70 border border-gray-200 text-gray-700 hover:bg-gray-100"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Stock
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDeleteSweet(sweet.id)} className="flex-1">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}

                {errors[sweet.id] && <p className="text-red-500 text-sm mt-2">{errors[sweet.id]}</p>}

                {editingSweet !== sweet.id && (
                  <div className="pt-2 border-t border-gray-100 mt-3">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1 text-gray-700">Quick Restock</p>
                        <Input
                          type="number"
                          min="1"
                          value={restockQuantities[sweet.id] || ""}
                          onChange={(e) =>
                            setRestockQuantities((prev) => ({
                              ...prev,
                              [sweet.id]: e.target.value,
                            }))
                          }
                          placeholder="Qty"
                          className="w-full h-9 text-base border-gray-300"
                        />
                      </div>
                      <Button
                        onClick={() => handleRestock(sweet.id)}
                        className="flex items-center gap-1 bg-gray-800 hover:bg-black text-white h-9"
                      >
                        <Package className="w-4 h-4" />
                        Restock
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
