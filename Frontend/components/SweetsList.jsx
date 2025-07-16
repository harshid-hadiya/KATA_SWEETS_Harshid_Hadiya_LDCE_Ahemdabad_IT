"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, ShoppingCart, Package, Edit2, Check, X } from "lucide-react"
import PurchaseModal from "./PurchaseModal.jsx"

export default function SweetsList({ sweets, onDeleteSweet, onPurchaseSweet, onRestockSweet, onUpdateSweet }) {
  const [purchaseQuantities, setPurchaseQuantities] = useState({})
  const [restockQuantities, setRestockQuantities] = useState({})
  const [editingSweet, setEditingSweet] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [errors, setErrors] = useState({})
  const [purchaseModal, setPurchaseModal] = useState({ isOpen: false, sweet: null })

  const handlePurchase = (sweetId) => {
    const quantity = Number.parseInt(purchaseQuantities[sweetId] || 1)
    if (quantity <= 0) {
      setErrors((prev) => ({ ...prev, [sweetId]: "Purchase quantity must be greater than 0" }))
      return
    }

    try {
      const result = onPurchaseSweet(sweetId, quantity)
      setPurchaseQuantities((prev) => ({ ...prev, [sweetId]: "" }))
      setErrors((prev) => ({ ...prev, [sweetId]: "" }))

      // Show success message with purchase details
      alert(
        `Purchase Successful!\nItem: ${result.sweetName}\nQuantity: ${result.quantityPurchased}\nTotal Cost: ₹${result.totalCost.toFixed(2)}\nRemaining Stock: ${result.remainingStock}`,
      )
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sweetId]: error.message }))
    }
  }

  const handleRestock = (sweetId) => {
    const quantity = Number.parseInt(restockQuantities[sweetId] || 1)
    try {
      onRestockSweet(sweetId, quantity)
      setRestockQuantities((prev) => ({ ...prev, [sweetId]: "" }))
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sweetId]: error.message }))
    }
  }

  const startEditing = (sweet) => {
    setEditingSweet(sweet.id)
    setEditForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
    })
  }

  const cancelEditing = () => {
    setEditingSweet(null)
    setEditForm({})
    setErrors({})
  }

  const saveEdit = (sweetId) => {
    try {
      const updates = {
        name: editForm.name,
        category: editForm.category,
        price: Number.parseFloat(editForm.price),
        quantity: Number.parseInt(editForm.quantity),
      }

      onUpdateSweet(sweetId, updates)
      setEditingSweet(null)
      setEditForm({})
      setErrors({})
    } catch (error) {
      setErrors((prev) => ({ ...prev, [sweetId]: error.message }))
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      chocolate: "bg-amber-100 text-amber-800",
      candy: "bg-pink-100 text-pink-800",
      pastry: "bg-orange-100 text-orange-800",
      gummy: "bg-green-100 text-green-800",
      "hard candy": "bg-purple-100 text-purple-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  if (sweets.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No sweets found. Add some sweets to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sweet Inventory ({sweets.length} items)</h2>

      <div className="grid gap-4">
        {sweets.map((sweet) => (
          <Card key={sweet.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingSweet === sweet.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Sweet name"
                      />
                      <Input
                        value={editForm.category}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="Category"
                      />
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-lg">{sweet.name}</CardTitle>
                      <Badge className={getCategoryColor(sweet.category)}>{sweet.category}</Badge>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editingSweet === sweet.id ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(sweet.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEditing(sweet)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteSweet(sweet.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  {editingSweet === sweet.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                    />
                  ) : (
                    <p className="text-lg font-semibold">₹{sweet.price.toFixed(2)}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  {editingSweet === sweet.id ? (
                    <Input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    />
                  ) : (
                    <p className={`text-lg font-semibold ${sweet.quantity < 5 ? "text-red-600" : "text-green-600"}`}>
                      {sweet.quantity} units
                      {sweet.quantity < 5 && <span className="text-xs text-red-500 ml-1">(Low Stock)</span>}
                    </p>
                  )}
                </div>
              </div>

              {editingSweet !== sweet.id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  {/* Purchase Section */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Purchase</p>
                    <Button
                      size="sm"
                      onClick={() => setPurchaseModal({ isOpen: true, sweet })}
                      disabled={sweet.quantity === 0}
                      className="flex items-center gap-1 w-full"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {sweet.quantity === 0 ? "Out of Stock" : "Buy Now"}
                    </Button>
                  </div>

                  {/* Restock Section */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Restock</p>
                    <div className="flex gap-2">
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
                        className="w-20"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestock(sweet.id)}
                        className="flex items-center gap-1"
                      >
                        <Package className="w-4 h-4" />
                        Restock
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {errors[sweet.id] && <p className="text-red-500 text-sm">{errors[sweet.id]}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Purchase Modal */}
      {purchaseModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PurchaseModal
            sweet={purchaseModal.sweet}
            onPurchase={(id, quantity) => {
              const result = onPurchaseSweet(id, quantity)
              return result
            }}
            onClose={() => setPurchaseModal({ isOpen: false, sweet: null })}
          />
        </div>
      )}
    </div>
  )
}
