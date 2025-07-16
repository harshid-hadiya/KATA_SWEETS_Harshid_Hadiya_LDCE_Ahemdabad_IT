"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candy, User, Shield } from "lucide-react"

export default function LoginScreen({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleLogin = (role) => {
    if (role === "admin") {
      if (credentials.username === "admin" && credentials.password === "admin123") {
        onLogin("admin", "Administrator")
      } else {
        setError("Invalid admin credentials")
      }
    } else {
      if (credentials.username.trim()) {
        onLogin("user", credentials.username)
      } else {
        setError("Please enter your name")
      }
    }
  }

  const handleQuickUserLogin = () => {
    onLogin("user", "Customer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Candy className="w-10 h-10 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">The Kata</h1>
          </div>
          <p className="text-gray-600">Sweet Shop Management System</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Quick Customer Access */}
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center pb-3">
              <CardTitle className="flex items-center justify-center gap-2 text-blue-700">
                <User className="w-5 h-5" />
                Customer Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleQuickUserLogin} className="w-full bg-blue-600 hover:bg-blue-700">
                Browse & Buy Sweets
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="border-2 border-red-200 hover:border-red-300 transition-colors">
            <CardHeader className="text-center pb-3">
              <CardTitle className="flex items-center justify-center gap-2 text-red-700">
                <Shield className="w-5 h-5" />
                Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button onClick={() => handleLogin("admin")} className="w-full bg-red-600 hover:bg-red-700">
                Admin Login
              </Button>

              <div className="text-xs text-gray-500 text-center">Demo: admin / admin123</div>
            </CardContent>
          </Card>

          {/* Named Customer Login */}
          <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="text-center pb-3">
              <CardTitle className="flex items-center justify-center gap-2 text-green-700">
                <User className="w-5 h-5" />
                Named Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer-name">Your Name</Label>
                <Input
                  id="customer-name"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>

              <Button onClick={() => handleLogin("user")} className="w-full bg-green-600 hover:bg-green-700">
                Continue as Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
