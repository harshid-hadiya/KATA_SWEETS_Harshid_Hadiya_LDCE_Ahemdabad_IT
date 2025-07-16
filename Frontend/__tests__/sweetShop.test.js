// This test file is for the in-memory SweetShop class and is not directly
// relevant for the API-driven system. New tests would be needed for API integration.
/*
import { SweetShop } from "../lib/sweetShop.js"

describe("SweetShop", () => {
  let shop

  beforeEach(() => {
    shop = new SweetShop()
  })

  describe("Adding Sweets", () => {
    test("should add a sweet with all required properties", () => {
      const sweet = {
        name: "Chocolate Bar",
        category: "chocolate",
        price: 2.5,
        quantity: 10,
      }

      const addedSweet = shop.addSweet(sweet)

      expect(addedSweet).toHaveProperty("id")
      expect(addedSweet.name).toBe("Chocolate Bar")
      expect(addedSweet.category).toBe("chocolate")
      expect(addedSweet.price).toBe(2.5)
      expect(addedSweet.quantity).toBe(10)
    })

    test("should generate unique IDs for each sweet", () => {
      const sweet1 = shop.addSweet({ name: "Sweet 1", category: "candy", price: 1, quantity: 5 })
      const sweet2 = shop.addSweet({ name: "Sweet 2", category: "candy", price: 1, quantity: 5 })

      expect(sweet1.id).not.toBe(sweet2.id)
    })

    test("should throw error when required fields are missing", () => {
      expect(() => {
        shop.addSweet({ name: "Incomplete Sweet" })
      }).toThrow("Missing required fields")
    })
  })

  describe("Viewing Sweets", () => {
    test("should return empty array when no sweets exist", () => {
      expect(shop.getAllSweets()).toEqual([])
    })

    test("should return all sweets", () => {
      shop.addSweet({ name: "Sweet 1", category: "candy", price: 1, quantity: 5 })
      shop.addSweet({ name: "Sweet 2", category: "chocolate", price: 2, quantity: 3 })

      const sweets = shop.getAllSweets()
      expect(sweets).toHaveLength(2)
    })
  })

  describe("Deleting Sweets", () => {
    test("should delete sweet by ID", () => {
      const sweet = shop.addSweet({ name: "Sweet 1", category: "candy", price: 1, quantity: 5 })

      shop.deleteSweet(sweet.id)

      expect(shop.getAllSweets()).toHaveLength(0)
    })

    test("should throw error when deleting non-existent sweet", () => {
      expect(() => {
        shop.deleteSweet("non-existent-id")
      }).toThrow("Sweet not found")
    })
  })

  describe("Searching Sweets", () => {
    beforeEach(() => {
      shop.addSweet({ name: "Milk Chocolate", category: "chocolate", price: 2.5, quantity: 10 })
      shop.addSweet({ name: "Gummy Bears", category: "candy", price: 1.5, quantity: 20 })
      shop.addSweet({ name: "Chocolate Cake", category: "pastry", price: 15.0, quantity: 5 })
    })

    test("should search by name", () => {
      const results = shop.searchSweets({ name: "chocolate" })
      expect(results).toHaveLength(2)
    })

    test("should search by category", () => {
      const results = shop.searchSweets({ category: "candy" })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe("Gummy Bears")
    })

    test("should search by price range", () => {
      const results = shop.searchSweets({ minPrice: 2, maxPrice: 10 })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe("Milk Chocolate")
    })
  })

  describe("Purchasing Sweets", () => {
    test("should decrease quantity when purchasing", () => {
      const sweet = shop.addSweet({ name: "Sweet 1", category: "candy", price: 1, quantity: 10 })

      shop.purchaseSweet(sweet.id, 3)

      const updatedSweet = shop.getAllSweets().find((s) => s.id === sweet.id)
      expect(updatedSweet.quantity).toBe(7)
    })

    test("should throw error when insufficient stock", () => {
      const sweet = shop.addSweet({ name: "Sweet 1", category: "candy", price: 1, quantity: 5 })

      expect(() => {
        shop.purchaseSweet(sweet.id, 10)
      }).toThrow("Insufficient stock")
    })

    test("should throw error when purchasing non-existent sweet", () => {
      expect(() => {
        shop.purchaseSweet("non-existent-id", 1)
      }).toThrow("Sweet not found")
    })
  })

  describe("Restocking Sweets", () => {
    test("should increase quantity when restocking", () => {
      const sweet = shop.addSweet({ name: "Sweet 1", category: "candy", price: 1, quantity: 5 })

      shop.restockSweet(sweet.id, 10)

      const updatedSweet = shop.getAllSweets().find((s) => s.id === sweet.id)
      expect(updatedSweet.quantity).toBe(15)
    })

    test("should throw error when restocking non-existent sweet", () => {
      expect(() => {
        shop.restockSweet("non-existent-id", 5)
      }).toThrow("Sweet not found")
    })
  })

  describe("Sorting Sweets", () => {
    beforeEach(() => {
      shop.addSweet({ name: "Expensive Sweet", category: "chocolate", price: 10.0, quantity: 5 })
      shop.addSweet({ name: "Cheap Sweet", category: "candy", price: 1.0, quantity: 20 })
      shop.addSweet({ name: "Medium Sweet", category: "pastry", price: 5.0, quantity: 10 })
    })

    test("should sort by price ascending", () => {
      const sorted = shop.getSortedSweets("price", "asc")
      expect(sorted[0].price).toBe(1.0)
      expect(sorted[2].price).toBe(10.0)
    })

    test("should sort by name descending", () => {
      const sorted = shop.getSortedSweets("name", "desc")
      expect(sorted[0].name).toBe("Medium Sweet")
      expect(sorted[2].name).toBe("Cheap Sweet")
    })
  })
})
*/
