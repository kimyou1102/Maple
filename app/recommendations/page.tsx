"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, MapPin, Heart, Eye, MessageCircle } from "lucide-react"

interface RecommendedPlace {
  id: string
  name: string
  category: string
  address: string
  rating: number
  reviewCount: number
  viewCount: number
  likeCount: number
  description: string
  tags: string[]
  image: string
  isPopular: boolean
  isTrending: boolean
  recentReviews: {
    author: string
    rating: number
    comment: string
    date: string
  }[]
}

const mockRecommendedPlaces: RecommendedPlace[] = [
  {
    id: "1",
    name: "홍대 교촌치킨",
    category: "맛집",
    address: "서울특별시 마포구 와우산로 29길 15",
    rating: 4.5,
    reviewCount: 128,
    viewCount: 1250,
    likeCount: 89,
    description: "홍대에서 가장 맛있는 치킨집! 바삭한 튀김과 특제 소스가 일품입니다.",
    tags: ["치킨", "야식", "단체모임", "배달가능"],
    image: "/placeholder.svg?height=200&width=300",
    isPopular: true,
    isTrending: false,
    recentReviews: [
      { author: "맛집헌터", rating: 5, comment: "정말 맛있어요! 강추합니다", date: "2024-01-15" },
      { author: "치킨러버", rating: 4, comment: "바삭하고 좋네요", date: "2024-01-14" },
    ],
  },
  {
    id: "2",
    name: "스타벅스 홍대점",
    category: "카페",
    address: "서울특별시 마포구 홍익로 3길 20",
    rating: 4.2,
    reviewCount: 256,
    viewCount: 2100,
    likeCount: 156,
    description: "공부하기 좋은 분위기의 카페. 넓은 공간과 편안한 좌석이 매력적입니다.",
    tags: ["공부", "와이파이", "24시간", "주차가능"],
    image: "/placeholder.svg?height=200&width=300",
    isPopular: true,
    isTrending: true,
    recentReviews: [
      { author: "카페러버", rating: 4, comment: "공부하기 좋아요", date: "2024-01-16" },
      { author: "학생A", rating: 5, comment: "조용하고 넓어서 좋습니다", date: "2024-01-15" },
    ],
  },
  {
    id: "3",
    name: "홍대 클럽 에반스",
    category: "엔터테인먼트",
    address: "서울특별시 마포구 동교로 23길 7",
    rating: 4.0,
    reviewCount: 89,
    viewCount: 890,
    likeCount: 67,
    description: "홍대 최고의 클럽! 최신 음악과 화려한 조명으로 완벽한 밤을 만들어드립니다.",
    tags: ["클럽", "댄스", "주말", "파티"],
    image: "/placeholder.svg?height=200&width=300",
    isPopular: false,
    isTrending: true,
    recentReviews: [
      { author: "파티피플", rating: 5, comment: "분위기 최고!", date: "2024-01-13" },
      { author: "댄서", rating: 4, comment: "음악이 좋아요", date: "2024-01-12" },
    ],
  },
  {
    id: "4",
    name: "홍대 서점 - 교보문고",
    category: "문화",
    address: "서울특별시 마포구 월드컵로 10길 25",
    rating: 4.3,
    reviewCount: 167,
    viewCount: 1450,
    likeCount: 112,
    description: "다양한 책과 문화 공간이 있는 복합 서점. 독서와 휴식을 동시에 즐길 수 있습니다.",
    tags: ["책", "문화", "휴식", "카페"],
    image: "/placeholder.svg?height=200&width=300",
    isPopular: true,
    isTrending: false,
    recentReviews: [
      { author: "책벌레", rating: 5, comment: "책 종류가 다양해요", date: "2024-01-14" },
      { author: "독서가", rating: 4, comment: "조용하고 좋습니다", date: "2024-01-13" },
    ],
  },
]

const categories = [
  { id: "all", name: "전체", icon: "🏪" },
  { id: "restaurant", name: "맛집", icon: "🍽️" },
  { id: "cafe", name: "카페", icon: "☕" },
  { id: "entertainment", name: "엔터테인먼트", icon: "🎉" },
  { id: "culture", name: "문화", icon: "🎨" },
]

export default function RecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("popular")

  const filteredPlaces = mockRecommendedPlaces.filter((place) => {
    const categoryMatch = selectedCategory === "all" || place.category.toLowerCase() === selectedCategory

    const tabMatch =
      activeTab === "all" ||
      (activeTab === "popular" && place.isPopular) ||
      (activeTab === "trending" && place.isTrending)

    return categoryMatch && tabMatch
  })

  const handleLike = (placeId: string) => {
    // 좋아요 기능 구현 (실제로는 API 호출)
    console.log(`Liked place: ${placeId}`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">장소 추천</h1>
          <p className="text-gray-600">인기 있는 장소들과 트렌딩 스팟을 확인해보세요</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="popular">
              <Star className="w-4 h-4 mr-2" />
              인기 장소
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              트렌딩
            </TabsTrigger>
            <TabsTrigger value="all">전체</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 장소 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">추천 장소가 없습니다</h3>
                    <p className="text-gray-600">다른 카테고리를 선택해보세요</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {place.isPopular && <Badge className="bg-red-500">인기</Badge>}
                    {place.isTrending && <Badge className="bg-orange-500">트렌딩</Badge>}
                  </div>
                </div>

                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{place.name}</h3>
                    <Button size="sm" variant="ghost" onClick={() => handleLike(place.id)} className="p-1">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">{renderStars(place.rating)}</div>
                    <span className="text-sm text-gray-600">
                      {place.rating} ({place.reviewCount}개 리뷰)
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {place.address}
                  </p>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{place.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {place.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {place.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {place.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {place.reviewCount}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {place.category}
                    </Badge>
                  </div>

                  {/* 최근 리뷰 */}
                  {place.recentReviews.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">최근 리뷰</h4>
                      <div className="space-y-1">
                        {place.recentReviews.slice(0, 1).map((review, index) => (
                          <div key={index} className="text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="font-medium">{review.author}</span>
                              <div className="flex">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-gray-600 line-clamp-1">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
