"use client"

import { useState, useEffect, useCallback } from "react"
import { SweetShop } from "../lib/sweetShop.js"
import CustomerNameForm from "../components/CustomerNameForm.jsx"
import UserDashboard from "../components/UserDashboard.jsx"
import Toaster from "@/components/ui/toaster.jsx" // This should be a default import
import { useToast } from "@/components/ui/use-toast"
import { api } from "../lib/api.js"

export default function CustomerPage() {
  const [shop] = useState(() => new SweetShop())
  const [sweets, setSweets] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [isNameSet, setIsNameSet] = useState(false)
  const [cart, setCart] = useState([])
  const [customerToken, setCustomerToken] = useState(null)
  const { toast } = useToast()

  const refreshSweets = useCallback(async () => {
    try {
      const fetchedSweets = await api.getAllSweets()
      setSweets(fetchedSweets.map((s) => ({ ...s, id: s._id })))
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load sweets: ${error.message}`,
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    const storedCustomerName = localStorage.getItem("customerName")
    const storedCustomerMobile = localStorage.getItem("customerMobile")
    const storedCustomerToken = localStorage.getItem("customerToken")

    if (storedCustomerName && storedCustomerMobile && storedCustomerToken) {
      setCustomerName(storedCustomerName)
      setCustomerMobile(storedCustomerMobile)
      setCustomerToken(storedCustomerToken)
      setIsNameSet(true)
      refreshSweets()
    } else {
      refreshSweets()
    }

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

      shop.processCartPurchase(
        [
          { sweetId: sweet1.id, quantity: 2 },
          { sweetId: sweet2.id, quantity: 1 },
        ],
        "Sample Customer",
      )
    } catch (error) {
      console.error("Error loading sample data for in-memory shop:", error)
    }
  }, [refreshSweets, shop])

  const handleNameSubmit = async (name, mobile) => {
    try {
      const response = await api.customerLogin(name, mobile)
      setCustomerName(response.customer.name)
      setCustomerMobile(response.customer.mobile)
      setCustomerToken(response.token)
      setIsNameSet(true)
      localStorage.setItem("customerName", response.customer.name)
      localStorage.setItem("customerMobile", response.customer.mobile)
      localStorage.setItem("customerToken", response.token)
      toast({
        title: "Welcome!",
        description: `Logged in as ${response.customer.name}.`,
      })
      refreshSweets()
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const addToCart = (sweetId, quantityToAdd) => {
    const existingItemIndex = cart.findIndex((item) => item.sweetId === sweetId)
    const sweetInShop = sweets.find((s) => s.id === sweetId)

    if (!sweetInShop) {
      throw new Error("Sweet not found in inventory.")
    }
    if (quantityToAdd <= 0) {
      throw new Error("Quantity to add must be greater than 0.")
    }
    if (sweetInShop.quantity === 0) {
      throw new Error(`${sweetInShop.name} is out of stock.`)
    }

    let newTotalQuantityInCart = quantityToAdd
    if (existingItemIndex > -1) {
      newTotalQuantityInCart = cart[existingItemIndex].quantity + quantityToAdd
    }

    if (sweetInShop.quantity < newTotalQuantityInCart) {
      throw new Error(`Insufficient stock for ${sweetInShop.name}. Only ${sweetInShop.quantity} units available.`)
    }

    if (existingItemIndex > -1) {
      setCart((prevCart) => {
        return prevCart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: newTotalQuantityInCart } : item,
        )
      })
    } else {
      setCart((prevCart) => {
        return [...prevCart, { sweetId, quantity: quantityToAdd }]
      })
    }
  }

  const removeFromCart = (sweetId) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => item.sweetId !== sweetId)
    })
  }

  const updateCartItemQuantity = (sweetId, newQuantity) => {
    const sweetInShop = sweets.find((s) => s.id === sweetId)
    if (!sweetInShop) {
      throw new Error("Sweet not found in inventory for update.")
    }
    if (newQuantity < 0) {
      throw new Error("Quantity cannot be negative.")
    }
    if (sweetInShop.quantity < newQuantity) {
      throw new Error(`Only ${sweetInShop.quantity} units of ${sweetInShop.name} available.`)
    }

    if (newQuantity === 0) {
      removeFromCart(sweetId)
    } else {
      setCart((prevCart) => {
        return prevCart.map((item) => (item.sweetId === sweetId ? { ...item, quantity: newQuantity } : item))
      })
    }
  }

  const handleCheckout = async () => {
    if (!customerToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to make a purchase.",
        variant: "destructive",
      })
      throw new Error("Not authenticated")
    }

    const purchasedItemsSummary = []
    let totalTransactionCost = 0
    const transactionId = Date.now().toString()

    try {
      for (const cartItem of cart) {
        const sweet = sweets.find((s) => s.id === cartItem.sweetId)
        if (!sweet) {
          throw new Error(`Sweet with ID ${cartItem.sweetId} not found.`)
        }
        if (cartItem.quantity > sweet.quantity) {
          throw new Error(`Insufficient stock for ${sweet.name}. Only ${sweet.quantity} available.`)
        }

        const purchaseResponse = await api.purchaseSweet(customerToken, cartItem.sweetId, cartItem.quantity)
        purchasedItemsSummary.push({
          sweetName: sweet.name,
          quantityPurchased: cartItem.quantity,
          unitPrice: sweet.price,
          itemTotalCost: purchaseResponse.purchase.totalPrice,
          remainingStock: sweet.quantity - cartItem.quantity,
        })
        totalTransactionCost += purchaseResponse.purchase.totalPrice
      }

      setCart([])
      refreshSweets()

      toast({
        title: "Purchase Successful!",
        description: "Your order has been placed.",
      })

      return {
        transactionId,
        customerName,
        purchaseDate: new Date().toISOString(),
        totalTransactionCost,
        purchasedItems: purchasedItemsSummary,
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleStartNewSession = () => {
    setIsNameSet(false)
    setCustomerName("")
    setCustomerMobile("")
    setCustomerToken(null)
    setCart([])
    localStorage.removeItem("customerName")
    localStorage.removeItem("customerMobile")
    localStorage.removeItem("customerToken")
  }

  if (!isNameSet) {
    return <CustomerNameForm onSubmit={handleNameSubmit} />
  }

  return (
    <>
      <Toaster />
      <UserDashboard
        sweets={sweets}
        shop={shop}
        userName={customerName}
        onStartNewSession={handleStartNewSession}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
        handleCheckout={handleCheckout}
      />
    </>
  )
}
