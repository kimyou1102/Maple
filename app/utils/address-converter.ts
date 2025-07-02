// Mock address conversion utility
// In a real application, this would use a geocoding API like Naver Maps API or Google Maps API

interface Bounds {
  north: number
  south: number
  east: number
  west: number
}

// Mock address data for the Hongdae area
const mockAddresses = [
  {
    bounds: { north: 37.5565, south: 37.555, east: 126.925, west: 126.92 },
    address: "서울특별시 마포구 와우산로 일대",
  },
  {
    bounds: { north: 37.56, south: 37.555, east: 126.93, west: 126.925 },
    address: "서울특별시 마포구 홍익로 일대",
  },
  {
    bounds: { north: 37.565, south: 37.56, east: 126.935, west: 126.93 },
    address: "서울특별시 마포구 동교로 일대",
  },
  {
    bounds: { north: 37.56, south: 37.555, east: 126.925, west: 126.92 },
    address: "서울특별시 마포구 어울마당로 일대",
  },
  {
    bounds: { north: 37.565, south: 37.56, east: 126.925, west: 126.92 },
    address: "서울특별시 마포구 월드컵로 일대",
  },
]

export async function convertBoundsToAddress(bounds: Bounds): Promise<string> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const centerLat = (bounds.north + bounds.south) / 2
  const centerLng = (bounds.east + bounds.west) / 2

  // Find the closest matching address
  let closestAddress = "서울특별시 마포구 홍대 일대"
  let minDistance = Number.POSITIVE_INFINITY

  for (const mockAddr of mockAddresses) {
    const mockCenterLat = (mockAddr.bounds.north + mockAddr.bounds.south) / 2
    const mockCenterLng = (mockAddr.bounds.east + mockAddr.bounds.west) / 2

    const distance = Math.sqrt(Math.pow(centerLat - mockCenterLat, 2) + Math.pow(centerLng - mockCenterLng, 2))

    if (distance < minDistance) {
      minDistance = distance
      closestAddress = mockAddr.address
    }
  }

  // Calculate approximate area size
  const latDiff = bounds.north - bounds.south
  const lngDiff = bounds.east - bounds.west
  const areaSize = latDiff * lngDiff * 10000 // Rough conversion to area

  if (areaSize > 0.5) {
    return `${closestAddress} (넓은 지역)`
  } else if (areaSize > 0.1) {
    return `${closestAddress} (중간 지역)`
  } else {
    return `${closestAddress} (좁은 지역)`
  }
}

export function getDetailedAddress(lat: number, lng: number): string {
  // Mock detailed address for specific coordinates
  const addresses = [
    "서울특별시 마포구 와우산로 29길 15",
    "서울특별시 마포구 홍익로 3길 20",
    "서울특별시 마포구 동교로 23길 7",
    "서울특별시 마포구 어울마당로 5길 12",
    "서울특별시 마포구 월드컵로 10길 25",
  ]

  const index = Math.floor((lat + lng) * 1000) % addresses.length
  return addresses[index]
}
