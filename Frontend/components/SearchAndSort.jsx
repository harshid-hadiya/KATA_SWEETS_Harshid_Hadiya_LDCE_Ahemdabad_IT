"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, SortAsc, SortDesc } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { api } from "../lib/api.js"

export default function SearchAndSort({ onSearch, onSort, onClearSearch, currentSweets }) {
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
  })

  const [sortConfig, setSortConfig] = useState({
    field: "name",
    order: "asc",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const categories = [
    "chocolate",
    "candy",
    "pastry",
    "gummy",
    "hard candy",
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

  const handleSearch = async () => {
    setIsLoading(true)
    const params = {}
    if (searchParams.name) params.name = searchParams.name
    if (searchParams.category && searchParams.category !== "all") params.category = searchParams.category
    if (searchParams.minPrice) params.minPrice = Number.parseFloat(searchParams.minPrice)
    if (searchParams.maxPrice) params.maxPrice = Number.parseFloat(searchParams.maxPrice)

    try {
      const results = await api.searchSweets(params)
      onSearch(results.map((s) => ({ ...s, id: s._id })))
      toast({
        title: "Search Complete",
        description: `${results.length} sweets found.`,
      })
    } catch (error) {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = async () => {
    setSearchParams({
      name: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
    })
    setIsLoading(true)
    try {
      const allSweets = await api.getAllSweets()
      onClearSearch(allSweets.map((s) => ({ ...s, id: s._id })))
      toast({
        title: "Search Cleared",
        description: "Displaying all sweets.",
      })
    } catch (error) {
      toast({
        title: "Error Clearing Search",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = () => {
    const sorted = [...currentSweets].sort((a, b) => {
      let aValue = a[sortConfig.field]
      let bValue = b[sortConfig.field]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortConfig.order === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })
    onSort(sorted)
    toast({
      title: "Sweets Sorted",
      description: `Sorted by ${sortConfig.field} ${sortConfig.order}.`,
    })
  }

  return (
    <Card className="w-full shadow-lg border border-gray-200 bg-white">
      <CardHeader className="pb-4 border-b border-gray-200">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
          <Search className="w-6 h-6 text-gray-600" />
          Search & Sort
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search-name" className="block text-sm font-medium text-gray-800 mb-1">
              Name
            </Label>
            <Input
              id="search-name"
              value={searchParams.name}
              onChange={(e) => setSearchParams((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Search by name"
              className="py-2 px-3 text-base border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="search-category" className="block text-sm font-medium text-gray-800 mb-1">
              Category
            </Label>
            <Select
              value={searchParams.category}
              onValueChange={(value) => setSearchParams((prev) => ({ ...prev, category: value }))}
              disabled={isLoading}
            >
              <SelectTrigger className="py-2 px-3 text-base border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="min-price" className="block text-sm font-medium text-gray-800 mb-1">
              Min Price (₹)
            </Label>
            <Input
              id="min-price"
              type="number"
              step="0.01"
              min="0"
              value={searchParams.minPrice}
              onChange={(e) => setSearchParams((prev) => ({ ...prev, minPrice: e.target.value }))}
              placeholder="0.00"
              className="py-2 px-3 text-base border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="max-price" className="block text-sm font-medium text-gray-800 mb-1">
              Max Price (₹)
            </Label>
            <Input
              id="max-price"
              type="number"
              step="0.01"
              min="0"
              value={searchParams.maxPrice}
              onChange={(e) => setSearchParams((prev) => ({ ...prev, maxPrice: e.target.value }))}
              placeholder="100.00"
              className="py-2 px-3 text-base border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="flex-1 bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? "Searching..." : "Search"}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1 bg-white/70 border border-gray-200 text-gray-700 hover:bg-gray-100 py-2 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>

        {/* Sort Section */}
        <div className="border-t pt-4 border-gray-200">
          <div className="flex items-end gap-4">
            <div>
              <Label htmlFor="sort-field" className="block text-sm font-medium text-gray-800 mb-1">
                Sort By
              </Label>
              <Select
                value={sortConfig.field}
                onValueChange={(value) => setSortConfig((prev) => ({ ...prev, field: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className="w-40 py-2 px-3 text-base border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="quantity">Quantity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-order" className="block text-sm font-medium text-gray-800 mb-1">
                Order
              </Label>
              <Select
                value={sortConfig.order}
                onValueChange={(value) => setSortConfig((prev) => ({ ...prev, order: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className="w-40 py-2 px-3 text-base border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSort}
              className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white font-semibold py-2 rounded-lg transition-colors duration-200"
              disabled={isLoading}
            >
              {sortConfig.order === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              Sort
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
