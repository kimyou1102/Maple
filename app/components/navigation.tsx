"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Share2, Calendar, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "지도", href: "/", icon: MapPin },
  { name: "공유 관리", href: "/shared", icon: Share2 },
  { name: "약속 정하기", href: "/appointment", icon: Calendar },
  { name: "추천", href: "/recommendations", icon: Star },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">장소 공유 서비스</h1>
          </div>
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
