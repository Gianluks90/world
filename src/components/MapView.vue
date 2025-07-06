<template>
    <div class="auth-container">
        <button class="auth-button" v-if="!auth.isLoggedIn" @click="auth.login">Login con Google</button>
        <button class="auth-button icon-button" v-else @click="auth.logout">
            <img :src="auth.user?.photoURL ?? undefined" alt="">
            Logout {{ auth.user?.displayName }}</button>
    </div>
    <div class="actions-container" v-if="auth.isLoggedIn">
        <button class="icon-button" @click="handleAddMarker">
            <MapPinPlus v-if="!isAddingMarker" />
            <Xmark v-else />
            <span v-if="!isAddingMarker">Aggiungi posizione</span>
            <span v-else>Seleziona sulla mappa o Annulla</span>
        </button>
    </div>
    <div ref="mapContainer" class="map-container"></div>

    <BaseDialog v-if="pendingCoordinates" @close="pendingCoordinates = null">
        <template #title>Nuova località in X: {{ pendingCoordinates.x.toFixed(0) }} Y: {{
            pendingCoordinates.y.toFixed(0) }}</template>
        <template #content>
            <p>Compila i dati per creare un nuovo punto di interesse sulla mappa.</p>
            <input class="dialog-input" v-model="newMarkerLabel" placeholder="Nome del luogo" />
        </template>
        <template #footer>
            <button class="icon-button" @click="pendingCoordinates = null">
                <Xmark />
                Annulla
            </button>
            <button :disabled="!newMarkerLabel" @click="saveMarker" class="icon-button">
                <MapPinPlus />
                Aggiungi
            </button>
        </template>
    </BaseDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import L from 'leaflet';
import { useAuthStore } from '../store/auth';
import { useMapStore } from '../store/map';
import { useMarkersStore } from '../store/useMarkerStore';
import { MapPinPlus, Xmark } from '@iconoir/vue';
import BaseDialog from './BaseDialog.vue';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const auth = useAuthStore()
const mapStore = useMapStore()
const markerStore = useMarkersStore()

const mapContainer = ref(null);
const isAddingMarker = ref(false)
const pendingCoordinates = ref<{ x: number; y: number } | null>(null)
const newMarkerLabel = ref('')

const leafletMarkers = new Map<string, L.Marker>()

watchEffect(() => {
  const map = mapStore.map
  if (!map) return

  const ids = new Set(markerStore.markers.map(m => m.id))

  for (const [id, marker] of leafletMarkers.entries()) {
    if (!ids.has(id)) {
      map.removeLayer(marker)
      leafletMarkers.delete(id)
    }
  }

  markerStore.markers.forEach(markerData => {
    if (!leafletMarkers.has(markerData.id)) {
      const m = L.marker([markerData.y, markerData.x])
        .addTo(map as L.Map)
        .bindPopup(markerData.label || 'Senza nome')
      leafletMarkers.set(markerData.id, m)
    } else {
      // se vuoi aggiornarlo, fai qui (es. posizione o popup)
    }
  })
})

onMounted(() => {
    const imageWidth = 2192
    const imageHeight = 1632

    const bounds: L.LatLngBoundsExpression = [
        [0, 0],
        [imageHeight, imageWidth]
    ]

    if (mapContainer.value) {
        const map = L.map(mapContainer.value, {
            crs: L.CRS.Simple,
            minZoom: 0,
            maxZoom: 2,
            zoomSnap: 0.5,
            zoomDelta: 0.5,
            center: [imageHeight / 2, imageWidth / 2],
            zoom: 0,
            maxBounds: bounds,
        })

        mapStore.map = map

        L.imageOverlay('/images/world.png', bounds).addTo(map)
        map.fitBounds(bounds)

        map.attributionControl.remove()
        map.zoomControl.setPosition('bottomleft');

        map.on('click', (e: L.LeafletMouseEvent) => {

            if (!isAddingMarker.value) return

            const coords = {
                x: e.latlng.lng,
                y: e.latlng.lat
            }

            pendingCoordinates.value = coords
            isAddingMarker.value = false

            console.log('Coordinate selezionate:', coords)
        });
    }

});

function handleAddMarker() {
    if (isAddingMarker.value) {
        isAddingMarker.value = false
    } else {
        isAddingMarker.value = true
        pendingCoordinates.value = null
    }
}

async function saveMarker() {
    if (!auth.user || !pendingCoordinates.value || !newMarkerLabel.value.trim()) {
        return
    }

    try {
        const userMarkersRef = collection(db, `users/${auth.user.uid}/markers`)

        await addDoc(userMarkersRef, {
            x: pendingCoordinates.value.x,
            y: pendingCoordinates.value.y,
            label: newMarkerLabel.value.trim(),
            createdAt: new Date()
        })

        // Reset form e stato
        pendingCoordinates.value = null
        newMarkerLabel.value = ''
        isAddingMarker.value = false
    } catch (error) {
        console.error('Errore nel salvataggio del marker:', error)
    }
}
</script>

<style scoped>
.map-container {
    height: 100vh;
    width: 100%;
    background-color: #212121;
}

.auth-container {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 1000;
}

.actions-container {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 1000;
}

.icon-button {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }
}


button {
    background-color: #212121;
    color: #fff;
    border: 1px solid #434343;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #333;
    }
}

button:disabled {
    opacity: .5;
    cursor: not-allowed;
}

button:disabled:hover {
    background-color: #212121;
}

.dialog-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 8px;
}

.dialog-input:focus {
    outline: none;
    border-color: #212121;
}
</style>