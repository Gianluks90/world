<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="dialog-container">
        <header class="dialog-header">
            <slot name="title"></slot>
        </header>
        <div class="dialog-content">
            <slot name="content"></slot>
        </div>
        <footer class="dialog-footer">
            <slot name="footer"></slot>
        </footer>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
}

.dialog-container {
  background: white;
  border-radius: 4px;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.dialog-header {
    background-color: #212121;
    color: white;
    padding: 12px;
}

.dialog-content {
    background-color: white;
    color: #212121;
    padding: 12px;

    p {
        margin: 0;
    }
}

.dialog-footer {
    background-color: white;
    color: #212121;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}
</style>