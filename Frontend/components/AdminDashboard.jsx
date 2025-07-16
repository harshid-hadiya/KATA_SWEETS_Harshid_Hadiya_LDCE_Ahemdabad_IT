"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SweetForm from "./SweetForm.jsx"
import AdminSweetsList from "./AdminSweetsList.jsx"
import SearchAndSort from "./SearchAndSort.jsx"
import PurchaseHistory from "./PurchaseHistory.jsx"
import { LogOut, Plus, Package, History, Home, Candy, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboard({
  sweets,
  onAddSweet,
  onDeleteSweet,
  onRestockSweet,
  onLogout,
  shop, // Still needed for in-memory purchase history
  userName,
}) {
  const [filteredSweets, setFilteredSweets] = useState(sweets)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const { toast } = useToast()

  // Update filteredSweets when sweets prop changes (e.g., after initial load or inventory changes)
  useEffect(() => {
    setFilteredSweets(sweets)
  }, [sweets])

  const handleSearch = useCallback((results) => {
    setFilteredSweets(results)
    setIsSearchActive(true)
  }, [])

  const handleSort = useCallback((sortedSweets) => {
    setFilteredSweets(sortedSweets)
  }, [])

  const handleClearSearch = useCallback((allSweets) => {
    setIsSearchActive(false)
    setFilteredSweets(allSweets)
  }, [])

  const lowStockItems = sweets.filter((sweet) => sweet.quantity < 5)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Candy className="w-8 h-8 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-900">The Kata Sweet Shop</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span>
                Welcome, <span className="font-semibold text-gray-700">{userName}</span>!
              </span>
            </div>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Shop</span>
              </Button>
            </Link>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Admin Info Banner */}
        <Card className="mb-8 bg-gray-100 border-gray-300 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-gray-800">Admin Panel</h3>
                <p className="text-sm text-gray-600">Manage inventory, add new sweets, and view sales history.</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="secondary"
              size="sm"
              className="bg-white/70 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <Package className="w-10 h-10 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{sweets.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <Package className="w-10 h-10 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 border border-gray-200 rounded-lg p-1 mb-6">
            <TabsTrigger
              value="inventory"
              className="flex items-center gap-2 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 rounded-md transition-all"
            >
              <Package className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="add-sweet"
              className="flex items-center gap-2 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 rounded-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Sweet
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 rounded-md transition-all"
            >
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            <SearchAndSort
              onSearch={handleSearch}
              onSort={handleSort}
              onClearSearch={handleClearSearch}
              currentSweets={isSearchActive ? filteredSweets : sweets} // Pass current sweets for client-side sort
            />
            <AdminSweetsList
              sweets={isSearchActive ? filteredSweets : sweets}
              onDeleteSweet={onDeleteSweet}
              onRestockSweet={onRestockSweet}
            />
          </TabsContent>

          <TabsContent value="add-sweet">
            <div className="max-w-md mx-auto">
              <SweetForm onAddSweet={onAddSweet} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <PurchaseHistory shop={shop} /> {/* Still using in-memory shop for history */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
