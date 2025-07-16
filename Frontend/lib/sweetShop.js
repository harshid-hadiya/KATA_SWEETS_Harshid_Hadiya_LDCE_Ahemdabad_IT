// lib/sweetShop.js
// This file now primarily serves as a reference for the SweetShop class structure
// and its methods, which are now being replaced by API calls.
// The `processCartPurchase` and `getPurchaseHistory` methods are kept for now
// as there are no direct API equivalents provided for multi-item cart processing
// or fetching full purchase history.

export class SweetShop {
  constructor() {
    this.sweets = []
    this.nextId = 1
    this.purchaseHistory = []
  }

  addSweet({ name, category, price, quantity }) {
    // Validate required fields
    if (!name || !category || price === undefined || quantity === undefined) {
      throw new Error("Missing required fields: name, category, price, and quantity are required")
    }

    // Validate data types
    if (typeof price !== "number" || typeof quantity !== "number") {
      throw new Error("Price and quantity must be numbers")
    }

    if (price < 0 || quantity < 0) {
      throw new Error("Price and quantity must be non-negative")
    }

    const sweet = {
      id: this.nextId.toString(),
      name,
      category,
      price,
      quantity,
      createdAt: new Date().toISOString(),
    }

    this.nextId++
    this.sweets.push(sweet)
    return sweet
  }

  getAllSweets() {
    return [...this.sweets]
  }

  deleteSweet(id) {
    const index = this.sweets.findIndex((sweet) => sweet.id === id)
    if (index === -1) {
      throw new Error("Sweet not found")
    }
    this.sweets.splice(index, 1)
  }

  searchSweets({ name, category, minPrice, maxPrice }) {
    return this.sweets.filter((sweet) => {
      const matchesName = !name || sweet.name.toLowerCase().includes(name.toLowerCase())
      const matchesCategory = !category || sweet.category.toLowerCase() === category.toLowerCase()
      const matchesMinPrice = minPrice === undefined || sweet.price >= minPrice
      const matchesMaxPrice = maxPrice === undefined || sweet.price <= maxPrice

      return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice
    })
  }

  // This method is now for processing a full cart
  // NOTE: This method is currently used for client-side purchase history
  // and will need to be replaced by API calls for each item in the cart.
  processCartPurchase(cartItems, customerName = "Walk-in Customer") {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Cart is empty or invalid")
    }

    const transactionId = Date.now().toString()
    const purchaseDate = new Date().toISOString()
    let totalTransactionCost = 0
    const purchasedItemsSummary = []

    // First pass: Validate all items in the cart
    for (const cartItem of cartItems) {
      const sweet = this.sweets.find((s) => s.id === cartItem.sweetId)
      if (!sweet) {
        throw new Error(`Sweet with ID ${cartItem.sweetId} not found in inventory.`)
      }
      if (cartItem.quantity <= 0) {
        throw new Error(`Purchase quantity for ${sweet.name} must be greater than 0.`)
      }
      if (sweet.quantity < cartItem.quantity) {
        throw new Error(
          `Insufficient stock for ${sweet.name}. Only ${sweet.quantity} units available, but ${cartItem.quantity} requested.`,
        )
      }
      if (sweet.quantity === 0) {
        throw new Error(`${sweet.name} is out of stock.`)
      }
    }

    // Second pass: Process purchase for each item if all validations passed
    for (const cartItem of cartItems) {
      const sweet = this.sweets.find((s) => s.id === cartItem.sweetId) // Re-find sweet as array might have changed
      sweet.quantity -= cartItem.quantity

      const itemTotalCost = sweet.price * cartItem.quantity
      totalTransactionCost += itemTotalCost

      const purchase = {
        id: `${transactionId}-${sweet.id}`, // Unique ID for each item in transaction
        transactionId: transactionId,
        sweetId: sweet.id,
        sweetName: sweet.name,
        quantity: cartItem.quantity,
        unitPrice: sweet.price,
        totalCost: itemTotalCost,
        customerName,
        purchaseDate,
      }
      this.purchaseHistory.push(purchase)

      purchasedItemsSummary.push({
        sweetName: sweet.name,
        quantityPurchased: cartItem.quantity,
        unitPrice: sweet.price,
        itemTotalCost: itemTotalCost,
        remainingStock: sweet.quantity,
      })
    }

    return {
      transactionId,
      customerName,
      purchaseDate,
      totalTransactionCost,
      purchasedItems: purchasedItemsSummary,
    }
  }

  restockSweet(id, quantity) {
    const sweet = this.sweets.find((s) => s.id === id)
    if (!sweet) {
      throw new Error("Sweet not found")
    }

    if (quantity < 0) {
      throw new Error("Restock quantity must be positive")
    }

    sweet.quantity += quantity
  }

  getSortedSweets(sweetsArray, sortBy, order = "asc") {
    const sorted = [...sweetsArray].sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (order === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })

    return sorted
  }

  updateSweet(id, updates) {
    const sweet = this.sweets.find((s) => s.id === id)
    if (!sweet) {
      throw new Error("Sweet not found")
    }

    // Validate updates
    if (updates.price !== undefined && (typeof updates.price !== "number" || updates.price < 0)) {
      throw new Error("Price must be a non-negative number")
    }

    if (updates.quantity !== undefined && (typeof updates.quantity !== "number" || updates.quantity < 0)) {
      throw new Error("Quantity must be a non-negative number")
    }

    Object.assign(sweet, updates)
    return sweet
  }

  getPurchaseHistory() {
    return [...this.purchaseHistory].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
  }

  getTodaysSales() {
    const today = new Date().toDateString()
    return this.purchaseHistory.filter((purchase) => new Date(purchase.purchaseDate).toDateString() === today)
  }
}
