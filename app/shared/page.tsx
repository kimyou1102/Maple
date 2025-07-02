"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Copy, Trash2, Edit, Eye, Users, Calendar, Search } from "lucide-react"

interface SharedMap {
  id: string
  title: string
  description: string
  createdAt: string
  viewCount: number
  shareCount: number
  participantCount: number
  region: string
  categories: string[]
  isActive: boolean
  shareUrl: string
}

const mockSharedMaps: SharedMap[] = [
  {
    id: "1",
    title: "홍대 맛집 투어",
    description: "친구들과 함께 가볼 홍대 맛집들",
    createdAt: "2024-01-15",
    viewCount: 45,
    shareCount: 12,
    participantCount: 8,
    region: "서울특별시 마포구 홍대 일대",
    categories: ["맛집", "카페"],
    isActive: true,
    shareUrl: "https://example.com/shared/1",
  },
  {
    id: "2",
    title: "강남 데이트 코스",
    description: "연인과 함께 가기 좋은 강남 장소들",
    createdAt: "2024-01-10",
    viewCount: 23,
    shareCount: 5,
    participantCount: 3,
    region: "서울특별시 강남구 강남역 일대",
    categories: ["카페", "문화", "엔터테인먼트"],
    isActive: true,
    shareUrl: "https://example.com/shared/2",
  },
  {
    id: "3",
    title: "이태원 핫플레이스",
    description: "이태원의 트렌디한 장소들 모음",
    createdAt: "2024-01-05",
    viewCount: 67,
    shareCount: 18,
    participantCount: 15,
    region: "서울특별시 용산구 이태원 일대",
    categories: ["맛집", "엔터테인먼트"],
    isActive: false,
    shareUrl: "https://example.com/shared/3",
  },
]

export default function SharedPage() {
  const [sharedMaps, setSharedMaps] = useState<SharedMap[]>(mockSharedMaps)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredMaps = sharedMaps.filter((map) => {
    const matchesSearch =
      map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      map.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" || (activeTab === "active" && map.isActive) || (activeTab === "inactive" && !map.isActive)
    return matchesSearch && matchesTab
  })

  const handleCopyLink = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert("링크가 복사되었습니다!")
    } catch (err) {
      console.error("링크 복사 실패:", err)
    }
  }

  const handleToggleActive = (id: string) => {
    setSharedMaps((maps) => maps.map((map) => (map.id === id ? { ...map, isActive: !map.isActive } : map)))
  }

  const handleDelete = (id: string) => {
    if (confirm("정말로 이 공유 지도를 삭제하시겠습니까?")) {
      setSharedMaps((maps) => maps.filter((map) => map.id !== id))
    }
  }

  const totalViews = sharedMaps.reduce((sum, map) => sum + map.viewCount, 0)
  const totalShares = sharedMaps.reduce((sum, map) => sum + map.shareCount, 0)
  const activeMaps = sharedMaps.filter((map) => map.isActive).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">공유 관리</h1>
          <p className="text-gray-600">내가 공유한 지도들을 관리하고 통계를 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Share2 className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 공유 지도</p>
                  <p className="text-2xl font-bold text-gray-900">{sharedMaps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 조회수</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 공유 횟수</p>
                  <p className="text-2xl font-bold text-gray-900">{totalShares}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">활성 지도</p>
                  <p className="text-2xl font-bold text-gray-900">{activeMaps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="지도 제목이나 설명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">전체</TabsTrigger>
                  <TabsTrigger value="active">활성</TabsTrigger>
                  <TabsTrigger value="inactive">비활성</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* 공유 지도 목록 */}
        <div className="space-y-6">
          {filteredMaps.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">공유 지도가 없습니다</h3>
                  <p className="text-gray-600">새로운 지도를 만들어 친구들과 공유해보세요!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredMaps.map((map) => (
              <Card key={map.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{map.title}</h3>
                        <Badge variant={map.isActive ? "default" : "secondary"}>
                          {map.isActive ? "활성" : "비활성"}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-3">{map.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {map.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        <p>📍 {map.region}</p>
                        <p>📅 생성일: {map.createdAt}</p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{map.viewCount} 조회</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          <span>{map.shareCount} 공유</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{map.participantCount} 참여자</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleCopyLink(map.shareUrl)}>
                        <Copy className="w-4 h-4 mr-1" />
                        링크 복사
                      </Button>

                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(map.id)}>
                        <Edit className="w-4 h-4 mr-1" />
                        {map.isActive ? "비활성화" : "활성화"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(map.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
