"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, User } from "lucide-react"
import type { Place, Category } from "../types"

interface PlaceListProps {
  places: Place[]
  categories: Category[]
  onPlaceSelect: (place: Place) => void
  selectedPlace?: Place | null
}

export default function PlaceList({ places, categories, onPlaceSelect, selectedPlace }: PlaceListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          장소 목록 ({places.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {places.length === 0 ? (
            <p className="text-gray-500 text-center py-4">선택된 영역에 장소가 없습니다.</p>
          ) : (
            places.map((place) => {
              const category = categories.find((c) => c.id === place.category)
              const isSelected = selectedPlace?.id === place.id

              return (
                <div
                  key={place.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 border-blue-300 ring-1 ring-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => onPlaceSelect(place)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{place.name}</h4>
                        {place.isNaverFavorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{place.comment}</p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          style={{ backgroundColor: category?.color + "20", color: category?.color }}
                          className="text-xs"
                        >
                          {category?.icon} {category?.name}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          {place.author}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
