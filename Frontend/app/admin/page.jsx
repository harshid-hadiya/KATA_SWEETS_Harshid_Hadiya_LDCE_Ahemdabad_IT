"use client"

import { useState, useEffect, useCallback } from "react"
import { SweetShop } from "../../lib/sweetShop.js" // Keep for purchase history for now
import AdminLoginScreen from "../../components/AdminLoginScreen.jsx"
import AdminDashboard from "../../components/AdminDashboard.jsx"
import { api } from "../../lib/api.js" // Import the API utility
import { useToast } from "@/components/ui/use-toast"
import Toaster from "@/components/ui/toaster.jsx"

export default function AdminPage() {
  // NOTE: The SweetShop class is kept here only for the client-side purchase history
  // as there's no API endpoint for fetching it. All other data operations will use the API.
  const [shop] = useState(() => new SweetShop())
  const [sweets, setSweets] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [ownerToken, setOwnerToken] = useState(null) // Store owner JWT
  const { toast } = useToast()

  const refreshSweets = useCallback(async () => {
    try {
      const fetchedSweets = await api.getAllSweets()
      setSweets(fetchedSweets.map((s) => ({ ...s, id: s._id }))) // Map _id to id for consistency
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load sweets: ${error.message}`,
        variant: "destructive",
      })
    }
  }, [toast])

  // Load initial data and try to restore session
  useEffect(() => {
    const storedAdminName = localStorage.getItem("adminName")
    const storedOwnerToken = localStorage.getItem("ownerToken")

    if (storedAdminName && storedOwnerToken) {
      setAdminName(storedAdminName)
      setOwnerToken(storedOwnerToken)
      setIsAuthenticated(true)
      refreshSweets()
    } else {
      // If no stored session, just load sweets (for initial in-memory shop data)
      refreshSweets()
    }

    // Add some sample data using the in-memory shop for purchase history demo
    // This part will be removed if a backend purchase history endpoint is added
    try {
      const sweet1 = shop.addSweet({ name: "Dark Chocolate Bar", category: "chocolate", price: 45.0, quantity: 20 })
      const sweet2 = shop.addSweet({ name: "Kaju Barfi", category: "barfi", price: 80.0, quantity: 15 })
      shop.addSweet({ name: "Besan Laddu", category: "laddu", price: 25.0, quantity: 30 })
      shop.addSweet({ name: "Carrot Halwa", category: "halwa", price: 60.0, quantity: 12 })
      shop.addSweet({ name: "Chocolate Chip Cookie", category: "cookie", price: 15.0, quantity: 40 })
      shop.addSweet({ name: "Fudge Brownie", category: "brownie", price: 35.0, quantity: 18 })
      shop.addSweet({ name: "Vanilla Muffin", category: "muffin", price: 30.0, quantity: 25 })
      shop.addSweet({ name: "Gulab Jamun", category: "gulab jamun", price: 20.0, quantity: 35 })
      shop.addSweet({ name: "Milk Peda", category: "peda", price: 40.0, quantity: 22 })
      shop.addSweet({ name: "Chocolate Truffle", category: "truffle", price: 55.0, quantity: 10 })

      // Add a sample purchase to history for demonstration
      shop.processCartPurchase(
        [
          { sweetId: sweet1.id, quantity: 2 },
          { sweetId: sweet2.id, quantity: 1 },
        ],
        "Admin Test Purchase",
      )
    } catch (error) {
      console.error("Error loading sample data for in-memory shop:", error)
    }
  }, [refreshSweets, shop])

  const handleLogin = async (username, password) => {
    try {
      const response = await api.ownerLogin(username, password)
      setAdminName("Administrator") // API doesn't return name, hardcode for now
      setOwnerToken(response.token)
      setIsAuthenticated(true)
      localStorage.setItem("adminName", "Administrator")
      localStorage.setItem("ownerToken", response.token)
      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Dashboard!",
      })
      refreshSweets() // Refresh sweets after login
    } catch (error) {
      console.error("Admin login failed:", error) // Added for debugging
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminName("")
    setOwnerToken(null)
    localStorage.removeItem("adminName")
    localStorage.removeItem("ownerToken")
    toast({
      title: "Logged Out",
      description: "You have been logged out from the admin panel.",
    })
  }

  const handleAddSweet = async (sweetData) => {
    if (!ownerToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in as an admin to add sweets.",
        variant: "destructive",
      })
      return
    }
    try {
      await api.addSweet(ownerToken, sweetData)
      refreshSweets()
      toast({
        title: "Sweet Added",
        description: `${sweetData.name} has been added to inventory.`,
      })
    } catch (error) {
      toast({
        title: "Failed to Add Sweet",
        description: error.message,
        variant: "destructive",
      })
      throw error // Re-throw to allow form to catch and display error
    }
  }

  const handleDeleteSweet = async (id) => {
    if (!ownerToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in as an admin to delete sweets.",
        variant: "destructive",
      })
      return
    }
    try {
      await api.deleteSweet(ownerToken, id)
      refreshSweets()
      toast({
        title: "Sweet Deleted",
        description: "Sweet has been removed from inventory.",
      })
    } catch (error) {
      toast({
        title: "Failed to Delete Sweet",
        description: error.message,
        variant: "destructive",
      })
      console.error("Error deleting sweet:", error)
    }
  }

  const handleRestockSweet = async (id, quantity) => {
    if (!ownerToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in as an admin to restock sweets.",
        variant: "destructive",
      })
      return
    }
    try {
      await api.restockSweet(ownerToken, id, quantity)
      refreshSweets()
      toast({
        title: "Sweet Restocked",
        description: `Sweet quantity updated.`,
      })
    } catch (error) {
      toast({
        title: "Failed to Restock Sweet",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // NOTE: The provided API does not have a general update sweet endpoint.
  // Only restock is available. The UI for editing name, category, price will be removed.
  const handleUpdateSweet = (id, updates) => {
    // This function will only be called for restock if UI is adjusted.
    // If other updates are needed, a new API endpoint would be required.
    console.warn("General sweet update not supported by current API. Only restock is available.")
    // For now, if this is called, it means there's a mismatch with UI.
    // If updates.quantity is present, call restock.
    if (updates.quantity !== undefined) {
      handleRestockSweet(id, updates.quantity)
    } else {
      toast({
        title: "Update Not Supported",
        description: "Only quantity restock is supported via API for sweets.",
        variant: "destructive",
      })
    }
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster />
        <AdminLoginScreen onLogin={handleLogin} />
      </>
    )
  }

  // Show admin dashboard
  return (
    <>
      <Toaster />
      <AdminDashboard
        sweets={sweets}
        onAddSweet={handleAddSweet}
        onUpdateSweet={handleUpdateSweet} // This will only handle restock now
        onDeleteSweet={handleDeleteSweet}
        onRestockSweet={handleRestockSweet}
        onLogout={handleLogout}
        shop={shop} // Still passing for in-memory purchase history
        userName={adminName}
      />
    </>
  )
}
