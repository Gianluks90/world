import { defineStore } from 'pinia'
import { ref } from 'vue'
import type L from 'leaflet'

export type MapMarker = {
  id: string
  x: number
  y: number
  label?: string
}

export const useMapStore = defineStore('map', () => {
  const map = ref<L.Map | null>(null)
  const markers = ref<MapMarker[]>([])

  const setMap = (instance: L.Map) => {
    map.value = instance
  }

  const setMarkers = (newMarkers: MapMarker[]) => {
    markers.value = newMarkers
  }

  return {
    map,
    setMap,
    markers,
    setMarkers
  }
})