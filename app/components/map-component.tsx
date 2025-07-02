"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Place, Category, SelectedRegion } from "../types"

interface MapComponentProps {
  places: Place[]
  categories: Category[]
  onRegionSelect: (region: SelectedRegion) => void
  onPlaceSelect: (place: Place) => void
  selectedRegion: SelectedRegion | null
  isAddingPlace?: boolean
  onAddPlacePosition?: (position: [number, number]) => void
}

// Convert lat/lng to pixel coordinates for our custom map
const latLngToPixel = (
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
) => {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * height
  return { x, y }
}

// Convert pixel coordinates back to lat/lng
const pixelToLatLng = (
  x: number,
  y: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
) => {
  const lng = bounds.minLng + (x / width) * (bounds.maxLng - bounds.minLng)
  const lat = bounds.maxLat - (y / height) * (bounds.maxLat - bounds.minLat)
  return { lat, lng }
}

export default function MapComponent({
  places,
  categories,
  onRegionSelect,
  onPlaceSelect,
  selectedRegion,
  isAddingPlace = false,
  onAddPlacePosition,
}: MapComponentProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Map bounds for Hongdae area
  const mapBounds = {
    minLat: 37.55,
    maxLat: 37.565,
    minLng: 126.915,
    maxLng: 126.935,
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!mapRef.current) return

      const rect = mapRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (isAddingPlace) {
        // 장소 추가 모드일 때는 위치만 선택
        const latLng = pixelToLatLng(x, y, mapBounds, rect.width, rect.height)
        onAddPlacePosition?.([latLng.lat, latLng.lng])
        return
      }

      setIsSelecting(true)
      setSelectionStart({ x, y })
      setSelectionEnd({ x, y })
    },
    [isAddingPlace, onAddPlacePosition, mapBounds],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelecting || !mapRef.current || !selectionStart) return

      const rect = mapRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setSelectionEnd({ x, y })
    },
    [isSelecting, selectionStart],
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelecting || !mapRef.current || !selectionStart) return

      const rect = mapRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setIsSelecting(false)

      // Convert pixel coordinates to lat/lng
      const startLatLng = pixelToLatLng(selectionStart.x, selectionStart.y, mapBounds, rect.width, rect.height)
      const endLatLng = pixelToLatLng(x, y, mapBounds, rect.width, rect.height)

      const region: SelectedRegion = {
        bounds: {
          north: Math.max(startLatLng.lat, endLatLng.lat),
          south: Math.min(startLatLng.lat, endLatLng.lat),
          east: Math.max(startLatLng.lng, endLatLng.lng),
          west: Math.min(startLatLng.lng, endLatLng.lng),
        },
      }

      onRegionSelect(region)
      setSelectionStart(null)
      setSelectionEnd(null)
    },
    [isSelecting, selectionStart, mapBounds, onRegionSelect],
  )

  const handlePlaceClick = (place: Place) => {
    setSelectedPlaceId(place.id)
    onPlaceSelect(place)
  }

  const renderSelectionBox = () => {
    if (!selectionStart || !selectionEnd) return null

    const left = Math.min(selectionStart.x, selectionEnd.x)
    const top = Math.min(selectionStart.y, selectionEnd.y)
    const width = Math.abs(selectionEnd.x - selectionStart.x)
    const height = Math.abs(selectionEnd.y - selectionStart.y)

    return (
      <div
        className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 pointer-events-none"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    )
  }

  const renderSelectedRegion = () => {
    if (!selectedRegion || !mapRef.current) return null

    const rect = mapRef.current.getBoundingClientRect()
    const topLeft = latLngToPixel(
      selectedRegion.bounds.north,
      selectedRegion.bounds.west,
      mapBounds,
      rect.width,
      rect.height,
    )
    const bottomRight = latLngToPixel(
      selectedRegion.bounds.south,
      selectedRegion.bounds.east,
      mapBounds,
      rect.width,
      rect.height,
    )

    const left = topLeft.x
    const top = topLeft.y
    const width = bottomRight.x - topLeft.x
    const height = bottomRight.y - topLeft.y

    return (
      <div
        className="absolute border-2 border-green-500 bg-green-500 bg-opacity-10 pointer-events-none border-dashed"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    )
  }

  const renderPlaces = () => {
    if (!mapRef.current) return null

    const rect = mapRef.current.getBoundingClientRect()

    return places.map((place) => {
      const category = categories.find((c) => c.id === place.category)
      if (!category) return null

      const position = latLngToPixel(place.coordinates[0], place.coordinates[1], mapBounds, rect.width, rect.height)
      const isSelected = selectedPlaceId === place.id

      return (
        <div
          key={place.id}
          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            isSelected ? "scale-125 z-10" : "hover:scale-110"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onClick={() => handlePlaceClick(place)}
          title={place.name}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center text-sm font-bold ${
              isSelected ? "border-yellow-400 ring-2 ring-yellow-300" : "border-white"
            }`}
            style={{ backgroundColor: category.color }}
          >
            {place.isNaverFavorite ? "⭐" : category.icon}
          </div>
          {isSelected && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {place.name}
            </div>
          )}
        </div>
      )
    })
  }

  useEffect(() => {
    // 외부에서 장소가 선택되었을 때 내부 상태 업데이트
    const selectedPlace = places.find((place) => place === places.find((p) => p.id === selectedPlaceId))
    if (!selectedPlace) {
      setSelectedPlaceId(null)
    }
  }, [places, selectedPlaceId])

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden rounded-lg">
      {/* Map Background */}
      <div
        ref={mapRef}
        className={`w-full h-full relative select-none ${isAddingPlace ? "cursor-crosshair" : "cursor-crosshair"}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundColor: "#f0f9ff",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isSelecting) {
            setIsSelecting(false)
            setSelectionStart(null)
            setSelectionEnd(null)
          }
        }}
      >
        {/* Street-like patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300"></div>
          <div className="absolute top-2/4 left-0 right-0 h-1 bg-gray-300"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-300"></div>
          <div className="absolute left-2/4 top-0 bottom-0 w-1 bg-gray-300"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-300"></div>
        </div>

        {/* Area label */}
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-sm text-sm font-medium">
          홍대 지역
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-sm text-xs text-gray-600 max-w-xs">
          {isAddingPlace ? "지도를 클릭하여 새 장소의 위치를 선택하세요" : "마우스를 드래그하여 영역을 선택하세요"}
        </div>

        {/* Selection box */}
        {renderSelectionBox()}

        {/* Selected region */}
        {renderSelectedRegion()}

        {/* Place markers */}
        {renderPlaces()}
      </div>
    </div>
  )
}
