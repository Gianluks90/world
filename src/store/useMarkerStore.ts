// stores/useMarkersStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'

interface MapMarker {
    id: string
    x: number
    y: number
    label?: string
}

export const useMarkersStore = defineStore('markers', () => {
  const markers = ref<MapMarker[]>([])
  const unsubscribe = ref<null | (() => void)>(null)

  const listenToUserMarkers = (userId: string) => {
    if (unsubscribe.value) unsubscribe.value() // chiude la vecchia
    const q = query(collection(db, `users/${userId}/markers`))

    unsubscribe.value = onSnapshot(q, (snapshot) => {
      markers.value = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          x: data.x,
          y: data.y,
          label: data.label
        }
      })
    })
  }

  return { markers, listenToUserMarkers }
})