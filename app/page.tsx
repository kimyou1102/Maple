"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Share2, List, User, Loader2 } from "lucide-react"
import PlaceList from "./components/place-list"
import CategoryFilter from "./components/category-filter"
import ShareDialog from "./components/share-dialog"
import PlaceDetails from "./components/place-details"
import { convertBoundsToAddress } from "./utils/address-converter"
import type { Place, Category, SelectedRegion } from "./types"
import AddPlaceDialog from "./components/add-place-dialog"

// Dynamic import for map to avoid SSR issues
const MapComponent = dynamic(() => import("./components/map-component"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg" />,
})

// Mock data for demonstration
const mockPlaces: Place[] = [
  {
    id: "1",
    name: "홍대 맛집 - 교촌치킨",
    coordinates: [37.5563, 126.9236],
    category: "restaurant",
    author: "맛집헌터",
    comment: "치킨이 정말 맛있어요!",
    isFavorite: false,
  },
  {
    id: "2",
    name: "스타벅스 홍대점",
    coordinates: [37.5573, 126.9246],
    category: "cafe",
    author: "카페러버",
    comment: "공부하기 좋은 곳",
    isFavorite: true,
  },
  {
    id: "3",
    name: "홍대 클럽 - 클럽 에반스",
    coordinates: [37.5553, 126.9226],
    category: "entertainment",
    author: "파티피플",
    comment: "주말 밤에 최고!",
    isFavorite: false,
  },
  {
    id: "4",
    name: "홍대 서점 - 교보문고",
    coordinates: [37.5583, 126.9256],
    category: "culture",
    author: "책벌레",
    comment: "다양한 책이 있어요",
    isFavorite: true,
  },
]

const categories: Category[] = [
  { id: "restaurant", name: "맛집", color: "#ef4444", icon: "🍽️" },
  { id: "cafe", name: "카페", color: "#3b82f6", icon: "☕" },
  { id: "entertainment", name: "엔터테인먼트", color: "#8b5cf6", icon: "🎉" },
  { id: "culture", name: "문화", color: "#10b981", icon: "🎨" },
]

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>(mockPlaces)
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories.map((c) => c.id))
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("map")
  const [regionAddress, setRegionAddress] = useState<string>("")
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [isAddingPlace, setIsAddingPlace] = useState(false)
  const [newPlacePosition, setNewPlacePosition] = useState<[number, number] | null>(null)

  // Mock authentication
  useEffect(() => {
    // Simulate checking authentication status
    const authStatus = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(authStatus === "true")
  }, [])

  // Convert region bounds to address when region changes
  useEffect(() => {
    if (selectedRegion) {
      setIsLoadingAddress(true)
      convertBoundsToAddress(selectedRegion.bounds)
        .then((address) => {
          setRegionAddress(address)
        })
        .catch(() => {
          setRegionAddress("주소를 불러올 수 없습니다")
        })
        .finally(() => {
          setIsLoadingAddress(false)
        })
    } else {
      setRegionAddress("")
    }
  }, [selectedRegion])

  const filteredPlaces = places.filter((place) => selectedCategories.includes(place.category))

  const placesInRegion = selectedRegion
    ? filteredPlaces.filter((place) => isPlaceInRegion(place, selectedRegion))
    : filteredPlaces

  function isPlaceInRegion(place: Place, region: SelectedRegion): boolean {
    const [lat, lng] = place.coordinates
    return (
      lat >= region.bounds.south && lat <= region.bounds.north && lng >= region.bounds.west && lng <= region.bounds.east
    )
  }

  const handleRegionSelect = (region: SelectedRegion) => {
    setSelectedRegion(region)
  }

  const handleShare = () => {
    if (!selectedRegion) {
      alert("먼저 지도에서 영역을 선택해주세요.")
      return
    }
    setIsShareDialogOpen(true)
  }

  const handleLogin = () => {
    // Mock login
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")

    // Simulate adding Naver favorites
    const naverFavorites: Place[] = [
      {
        id: "naver-1",
        name: "네이버 즐겨찾기 - 홍대 떡볶이",
        coordinates: [37.5568, 126.9241],
        category: "restaurant",
        author: "나",
        comment: "네이버 지도 즐겨찾기",
        isFavorite: true,
        isNaverFavorite: true,
      },
    ]

    setPlaces((prev) => [...prev, ...naverFavorites])
  }

  const handleAddPlace = (place: Omit<Place, "id">) => {
    const newPlace: Place = {
      ...place,
      id: `place-${Date.now()}`,
    }
    setPlaces((prev) => [...prev, newPlace])
    setIsAddingPlace(false)
    setNewPlacePosition(null)
  }

  const handleStartAddingPlace = () => {
    setIsAddingPlace(true)
    setNewPlacePosition(null)
  }

  const handleCancelAddingPlace = () => {
    setIsAddingPlace(false)
    setNewPlacePosition(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Controls */}
        <div className="flex justify-end items-center space-x-4 mb-6">
          {!isAuthenticated ? (
            <Button onClick={handleLogin} variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              네이버 로그인
            </Button>
          ) : (
            <Badge variant="secondary">
              <User className="w-3 h-3 mr-1" />
              로그인됨
            </Badge>
          )}
          <Button onClick={handleStartAddingPlace} variant="outline" size="sm" disabled={isAddingPlace}>
            <MapPin className="w-4 h-4 mr-2" />
            {isAddingPlace ? "위치 선택 중..." : "장소 추가"}
          </Button>
          <Button onClick={handleShare} disabled={!selectedRegion} size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            공유하기
          </Button>
        </div>

        {/* Region Selection Info */}
        {selectedRegion && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">선택된 영역</h3>
                  <div className="flex items-center mt-1">
                    {isLoadingAddress ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        주소를 불러오는 중...
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">{regionAddress}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline">{placesInRegion.length}개 장소</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map and Controls */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>지도</CardTitle>
                  <div className="flex items-center space-x-2">
                    <CategoryFilter
                      categories={categories}
                      selectedCategories={selectedCategories}
                      onCategoryChange={setSelectedCategories}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 lg:h-[500px] rounded-lg overflow-hidden">
                  <MapComponent
                    places={filteredPlaces}
                    categories={categories}
                    onRegionSelect={handleRegionSelect}
                    onPlaceSelect={setSelectedPlace}
                    selectedRegion={selectedRegion}
                    isAddingPlace={isAddingPlace}
                    onAddPlacePosition={setNewPlacePosition}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mobile Tabs */}
            <div className="lg:hidden mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="map">
                    <MapPin className="w-4 h-4 mr-2" />
                    지도
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="w-4 h-4 mr-2" />
                    목록
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="mt-4">
                  <PlaceList
                    places={filteredPlaces}
                    categories={categories}
                    onPlaceSelect={setSelectedPlace}
                    selectedPlace={selectedPlace}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <PlaceList
              places={placesInRegion}
              categories={categories}
              onPlaceSelect={setSelectedPlace}
              selectedPlace={selectedPlace}
            />
          </div>
        </div>
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <PlaceDetails
          place={selectedPlace}
          category={categories.find((c) => c.id === selectedPlace.category)}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        selectedRegion={selectedRegion}
        selectedCategories={selectedCategories}
        categories={categories}
      />

      {/* Add Place Dialog */}
      <AddPlaceDialog
        isOpen={!!newPlacePosition}
        onClose={handleCancelAddingPlace}
        onAddPlace={handleAddPlace}
        categories={categories}
        position={newPlacePosition}
      />
    </div>
  )
}
