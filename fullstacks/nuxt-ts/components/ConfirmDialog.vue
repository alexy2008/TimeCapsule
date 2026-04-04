<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay" @click.self="$emit('cancel')">
      <div class="dialog">
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message text-secondary">{{ message }}</p>
        <div class="dialog-actions flex justify-end gap-3">
          <button class="btn btn-secondary" @click="$emit('cancel')">取消</button>
          <button class="btn btn-primary" @click="$emit('confirm')">确认</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  message: string
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<style scoped>
.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.dialog-message {
  margin-bottom: 1.5rem;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
