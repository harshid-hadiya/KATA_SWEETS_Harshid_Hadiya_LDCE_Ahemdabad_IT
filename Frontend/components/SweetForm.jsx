"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function SweetForm({ onAddSweet }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset errors
    setErrors({})
    setIsLoading(true)

    // Validate form
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.price || isNaN(formData.price) || Number.parseFloat(formData.price) < 0) {
      newErrors.price = "Valid price is required"
    }
    if (!formData.quantity || isNaN(formData.quantity) || Number.parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Valid quantity is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      await onAddSweet({
        name: formData.name.trim(),
        category: formData.category,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
      })

      // Reset form
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
      })
    } catch (error) {
      setErrors({ submit: error.message })
      toast({
        title: "Error Adding Sweet",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
      <CardHeader className="pb-4 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">Add New Sweet</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-2">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter sweet name"
              className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="category" className="block text-lg font-medium text-gray-800 mb-2">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="price" className="block text-lg font-medium text-gray-800 mb-2">
              Price (₹)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
              className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all"
              disabled={isLoading}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="quantity" className="block text-lg font-medium text-gray-800 mb-2">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              placeholder="0"
              className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all"
              disabled={isLoading}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <Button
            type="submit"
            className="w-full bg-gray-800 hover:bg-black text-white font-bold py-3 text-xl rounded-lg shadow-md transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Adding Sweet..." : "Add Sweet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
