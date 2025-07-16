"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candy, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function AdminLoginScreen({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await onLogin(credentials.username, credentials.password)
    } catch (err) {
      console.error("Login attempt failed:", err)
      setError(err.message || "Login failed. Please try again.")
      toast({
        title: "Login Error",
        description: err.message || "Login failed. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
          <p className="text-gray-700 text-xl font-semibold">Admin Access Portal</p>
          <p className="text-md text-gray-600 mt-3">Please log in to manage your sweet shop.</p>
        </div>

        {/* Admin Login Card */}
        <Card className="border-2 border-gray-300 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl">
          <CardHeader className="text-center pb-4 border-b border-gray-200">
            <CardTitle className="flex items-center justify-center gap-3 text-gray-800 text-2xl font-semibold">
              <Shield className="w-6 h-6" />
              Administrator Login
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="username" className="block text-lg font-medium text-gray-800 mb-2">
                  Username
                </Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-lg font-medium text-gray-800 mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className="mt-1 block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-black text-white font-bold py-3 text-xl rounded-lg shadow-md transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login to Admin Panel"}
              </Button>

              <div className="text-xs text-gray-500 text-center">Demo Credentials: shopowner / ownerpass</div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Shop Button */}
        <div className="text-center">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 mx-auto bg-white/70 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Button>
          </Link>
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
