"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, User, Star, Heart } from "lucide-react"
import type { Place, Category } from "../types"

interface PlaceDetailsProps {
  place: Place
  category?: Category
  onClose: () => void
}

export default function PlaceDetails({ place, category, onClose }: PlaceDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            장소 상세 정보
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{place.name}</h3>
              {place.isNaverFavorite && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
            </div>
            {category && (
              <Badge style={{ backgroundColor: category.color + "20", color: category.color }} className="mb-3">
                {category.icon} {category.name}
              </Badge>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-1">위치</h4>
            <p className="text-sm text-gray-600">
              위도: {place.coordinates[0].toFixed(6)}, 경도: {place.coordinates[1].toFixed(6)}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-1">코멘트</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{place.comment}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-1" />
              <span>등록자: {place.author}</span>
            </div>
            {place.isNaverFavorite && (
              <Badge variant="outline" className="text-xs">
                네이버 즐겨찾기
              </Badge>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-1" />
              좋아요
            </Button>
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
