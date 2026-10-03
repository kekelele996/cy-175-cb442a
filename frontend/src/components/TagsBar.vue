<template>
  <div class="tags-bar">
    <span class="tags-label">标签：</span>
    <span v-if="activeTagIds.length === 0" class="tags-empty">暂无标签</span>
    <span class="tag-chip" v-for="tid in activeTagIds" :key="tid">
      {{ tagName(tid) }}
      <button class="tag-remove" @click="$emit('remove-tag', tid)">×</button>
    </span>
    <div class="tag-input-wrap">
      <input
        ref="inputRef"
        v-model="input"
        class="tag-input"
        type="text"
        placeholder="添加标签后回车"
        @keydown.enter="submit"
        @blur="submit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  activeTagIds: { type: Array, default: () => [] },
  allTags: { type: Array, default: () => [] }
})

const emit = defineEmits(['add-tag', 'remove-tag'])

const input = ref('')
const inputRef = ref(null)

const tagName = (id) => {
  const found = props.allTags.find((t) => t.id === id)
  return found ? found.name : ''
}

const submit = () => {
  const value = input.value.trim()
  if (value) {
    emit('add-tag', value)
    input.value = ''
  }
}
</script>

<style scoped>
.tags-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.tags-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.tags-empty {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.tag-remove {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
}

.tag-remove:hover {
  color: #d9534f;
}

.tag-input-wrap {
  flex: 1;
  min-width: 120px;
}

.tag-input {
  width: 100%;
  background: transparent;
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  color: var(--text-primary);
  font-size: 12px;
  outline: none;
  transition: border-color var(--transition);
}

.tag-input:focus {
  border-color: var(--accent);
  border-style: solid;
}
</style>
