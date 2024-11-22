export type MapPlace = {
  id: string
  requestedLanguage: string
  requestedRegion: string
  Eg: {
    addressComponents: PlaceAddressComponents[]
    displayName: string
    id: string
  }
  Fg: Set<string>
  Ng: {
    lat: () => number
    lng: () => number
  }
  distance: number
}

export type PlaceAddressComponents = {
  longText: string
  shortText: string
  types: string[]
}