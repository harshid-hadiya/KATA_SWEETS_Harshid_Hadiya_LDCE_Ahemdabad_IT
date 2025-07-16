"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"

export default function PurchaseHistory({ shop }) {
  // NOTE: This component currently relies on the in-memory `shop` instance
  // because the provided API does not include an endpoint to fetch purchase history.
  // For a fully API-driven system, a new backend endpoint would be required.
  const purchaseHistory = shop.getPurchaseHistory()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (purchaseHistory.length === 0) {
    return (
      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No purchase history available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardHeader className="pb-4 border-b border-gray-200">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <History className="w-6 h-6 text-gray-600" />
            Purchase History ({purchaseHistory.length} transactions)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            {purchaseHistory.map((purchase) => (
              <Card key={purchase.id} className="shadow-sm border border-gray-100 bg-white/80">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{purchase.sweetName}</h3>
                        <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                          #{purchase.id}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          Customer: <span className="font-medium text-gray-700">{purchase.customerName}</span>
                        </p>
                        <p>
                          Quantity: <span className="font-medium">{purchase.quantity} units</span>
                        </p>
                        <p>
                          Unit Price: <span className="font-medium">₹{purchase.unitPrice.toFixed(2)}</span>
                        </p>
                        <p>
                          Date: <span className="font-medium">{formatDate(purchase.purchaseDate)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-700">₹{purchase.totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
