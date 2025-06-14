"use client"

import { UserContext } from "@/app/_context/UserContext"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@stackframe/stack"
import { CreditCard, Star, Shield, Zap } from "lucide-react"
import Image from "next/image"
import { useContext } from "react"

function Credits() {
  const { userData } = useContext(UserContext)
  const user = useUser()

  const calculateProgress = () => {
    if (userData?.subscriptionId) {
      return Number(userData?.credits / 50000) * 100
    } else {
      return Number(userData?.credits / 10000) * 100
    }
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex gap-5 items-center">
        <div className="relative">
          <Image
            src={user?.profileImageUrl || "/placeholder.svg?height=60&width=60"}
            width={70}
            height={70}
            alt="Profile"
            className="rounded-full border-4 border-blue-100"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5">
            <Star className="h-4 w-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.displayName || "User"}</h2>
          <h2 className="text-gray-500">{user?.primaryEmail || "user@example.com"}</h2>
        </div>
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Token Usage
            </h2>
            <span className="font-medium text-blue-600">
              {userData?.credits || 0}/{userData?.subscriptionId ? "50,000" : "10,000"}
            </span>
          </div>
          <Progress
            value={calculateProgress()}
            className="h-2.5 bg-gray-100"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-blue-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Current Plan
          </h2>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              userData?.subscriptionId
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {userData?.subscriptionId ? "Premium Plan" : "Free Plan"}
          </div>
        </div>

        <div className="mt-8 p-6 border-2 border-blue-100 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-xl text-blue-800">Pro Plan</h2>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <h2 className="text-gray-700">50,000 Tokens</h2>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Unlimited consultations</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Advanced health analytics</span>
                </div>
              </div>
            </div>
            <h2 className="font-bold text-2xl text-blue-800">
              $10<span className="text-sm text-gray-500">/month</span>
            </h2>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white rounded-full py-6 shadow-md hover:shadow-lg transition-all">
            <CreditCard className="h-5 w-5 mr-2" /> Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Credits
