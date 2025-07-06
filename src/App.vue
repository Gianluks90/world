<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import MapView from './components/MapView.vue';
import { useMarkersStore } from './store/useMarkerStore';
import { auth } from './firebase';

const markerStore = useMarkersStore()

onAuthStateChanged(auth, (user) => {
  if (user) {
    markerStore.listenToUserMarkers(user.uid)
  }
})
</script>

<template>
  <MapView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
