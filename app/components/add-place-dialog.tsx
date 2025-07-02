"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import type { Place, Category } from "../types"

interface AddPlaceDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddPlace: (place: Omit<Place, "id">) => void
  categories: Category[]
  position: [number, number] | null
}

export default function AddPlaceDialog({ isOpen, onClose, onAddPlace, categories, position }: AddPlaceDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [comment, setComment] = useState("")
  const [author, setAuthor] = useState("익명")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !category || !position) {
      alert("모든 필수 정보를 입력해주세요.")
      return
    }

    onAddPlace({
      name: name.trim(),
      coordinates: position,
      category,
      author: author.trim() || "익명",
      comment: comment.trim() || "추천 장소입니다.",
      isFavorite: false,
    })

    // Reset form
    setName("")
    setCategory("")
    setComment("")
    setAuthor("익명")
  }

  const handleClose = () => {
    setName("")
    setCategory("")
    setComment("")
    setAuthor("익명")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />새 장소 추가
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {position && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <strong>선택된 위치:</strong> 위도 {position[0].toFixed(6)}, 경도 {position[1].toFixed(6)}
            </div>
          )}

          <div>
            <Label htmlFor="name">장소명 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="장소 이름을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="author">작성자</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="작성자 이름" />
          </div>

          <div>
            <Label htmlFor="comment">코멘트</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="이 장소에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" disabled={!name.trim() || !category || !position}>
              장소 추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
