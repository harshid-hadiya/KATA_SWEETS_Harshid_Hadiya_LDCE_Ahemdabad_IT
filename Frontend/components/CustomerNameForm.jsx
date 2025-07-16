"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candy, User, Shield } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast" // Import useToast

export default function CustomerNameForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false) // Loading state
  const { toast } = useToast() // Initialize toast

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const { name, mobileNumber } = formData

    if (!name.trim()) {
      setError("Please enter your name")
      setIsLoading(false)
      return
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long")
      setIsLoading(false)
      return
    }

    if (!mobileNumber.trim()) {
      setError("Mobile number is required")
      setIsLoading(false)
      return
    }

    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      setError("Please enter a valid 10-digit mobile number")
      setIsLoading(false)
      return
    }

    try {
      await onSubmit(name.trim(), mobileNumber.trim()) // onSubmit will handle API call and state update
    } catch (err) {
      // Error already handled by onSubmit's toast, but keep local error for form
      setError(err.message || "Login/Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("") // Clear error on input change
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Candy className="w-16 h-16 text-gray-800 animate-bounce-slow" />
            <h1 className="text-5xl font-bold text-gray-900 drop-shadow-md">The Kata</h1>
          </div>
          <p className="text-gray-700 text-xl font-semibold">Sweet Shop</p>
          <p className="text-md text-gray-600 mt-3">Welcome! Please enter your details to start your sweet journey.</p>
        </div>

        {/* Customer Name Form */}
        <Card className="border-2 border-gray-300 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl">
          <CardHeader className="text-center pb-4 border-b border-gray-200">
            <CardTitle className="flex items-center justify-center gap-3 text-gray-800 text-2xl font-semibold">
              <User className="w-6 h-6" />
              Your Sweet Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="customer-name" className="block text-lg font-medium text-gray-800 mb-2">
                  What's your name?
                </Label>
                <Input
                  id="customer-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., John Doe"
                  className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all"
                  autoFocus
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">This name will appear on your purchase receipts.</p>
              </div>

              <div>
                <Label htmlFor="mobile-number" className="block text-lg font-medium text-gray-800 mb-2">
                  Mobile Number
                </Label>
                <Input
                  id="mobile-number"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  placeholder="e.g., 9876543210"
                  className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">For order tracking and communication.</p>
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-black text-white font-bold py-3 text-xl rounded-lg shadow-md transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Start Shopping"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Admin Access & Shop Info */}
        <div className="text-center space-y-4">
          <Link href="/admin">
            <Button
              variant="outline"
              className="flex items-center gap-2 mx-auto bg-white/70 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <Shield className="w-4 h-4" />
              Admin Access
            </Button>
          </Link>

          <Card className="bg-white/50 border border-gray-200 shadow-sm">
            <CardContent className="p-5 text-center">
              <h3 className="font-semibold text-gray-800 mb-2">Why do we need your details?</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside text-left">
                <li>To generate personalized purchase receipts.</li>
                <li>To ensure accurate order tracking.</li>
                <li>For communication regarding your order.</li>
                <li>To provide a seamless shopping experience.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
