export interface Place {
  id: string
  name: string
  coordinates: [number, number] // [lat, lng]
  category: string
  author: string
  comment: string
  isFavorite: boolean
  isNaverFavorite?: boolean
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface SelectedRegion {
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}
