"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Share2 } from "lucide-react"
import type { SelectedRegion, Category } from "../types"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedRegion: SelectedRegion | null
  selectedCategories: string[]
  categories: Category[]
}

export default function ShareDialog({
  isOpen,
  onClose,
  selectedRegion,
  selectedCategories,
  categories,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const generateShareUrl = () => {
    if (!selectedRegion) return ""

    const params = new URLSearchParams({
      north: selectedRegion.bounds.north.toString(),
      south: selectedRegion.bounds.south.toString(),
      east: selectedRegion.bounds.east.toString(),
      west: selectedRegion.bounds.west.toString(),
      categories: selectedCategories.join(","),
    })

    return `${window.location.origin}?${params.toString()}`
  }

  const handleCopy = async () => {
    const url = generateShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const selectedCategoryNames = categories.filter((c) => selectedCategories.includes(c.id)).map((c) => c.name)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            지도 공유하기
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">공유 정보</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>선택 영역:</strong>
                {selectedRegion && (
                  <span className="ml-1">
                    위도 {selectedRegion.bounds.south.toFixed(4)} ~ {selectedRegion.bounds.north.toFixed(4)}, 경도{" "}
                    {selectedRegion.bounds.west.toFixed(4)} ~ {selectedRegion.bounds.east.toFixed(4)}
                  </span>
                )}
              </p>
              <div>
                <strong>필터된 카테고리:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCategoryNames.map((name) => (
                    <Badge key={name} variant="secondary" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">공유 링크</h4>
            <div className="flex space-x-2">
              <Input value={generateShareUrl()} readOnly className="text-sm" />
              <Button onClick={handleCopy} variant="outline" size="sm" className="shrink-0 bg-transparent">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">이 링크를 친구들과 공유하여 같은 지도를 볼 수 있습니다.</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Button onClick={handleCopy}>{copied ? "복사됨!" : "링크 복사"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
