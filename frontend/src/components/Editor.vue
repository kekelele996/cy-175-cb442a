<template>
  <div class="editor-wrap">
    <textarea
      ref="textareaRef"
      class="editor"
      :value="modelValue"
      @input="onInput"
      @keydown="onKeydown"
      placeholder="在这里用 Markdown 开始写作..."
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'selection-change', 'apply-toolbar'])

const textareaRef = ref(null)
const pendingSelection = ref(null)

const onInput = (e) => {
  emit('update:modelValue', e.target.value)
  emitSelection()
}

const onKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
    e.preventDefault()
    emit('apply-toolbar', 'bold')
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
    e.preventDefault()
    emit('apply-toolbar', 'italic')
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const el = textareaRef.value
    const start = el.selectionStart
    const end = el.selectionEnd
    const value = props.modelValue
    const newValue = value.slice(0, start) + '  ' + value.slice(end)
    emit('update:modelValue', newValue)
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + 2
    })
  }
}

const emitSelection = () => {
  const el = textareaRef.value
  if (!el) return
  emit('selection-change', { start: el.selectionStart, end: el.selectionEnd })
}

const setSelection = (start, end) => {
  const el = textareaRef.value
  if (!el) return
  el.focus()
  el.selectionStart = start
  el.selectionEnd = end
}

defineExpose({ setSelection, focus: () => textareaRef.value && textareaRef.value.focus() })

watch(
  () => props.modelValue,
  () => {
    nextTick(emitSelection)
  }
)
</script>

<style scoped>
.editor-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 20px 24px;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.7;
  tab-size: 2;
}
</style>
