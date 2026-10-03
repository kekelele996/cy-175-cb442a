<template>
  <div class="preview-wrap">
    <div class="preview-content markdown-body" v-html="html"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: { type: String, default: '' }
})

marked.setOptions({ breaks: true, gfm: true })

const html = computed(() => {
  try {
    return marked.parse(props.content || '')
  } catch (err) {
    return `<pre style="color:#d9534f">渲染失败：${err.message}</pre>`
  }
})
</script>

<style scoped>
.preview-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background: var(--bg-primary);
}

.preview-content {
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.75;
  color: var(--text-primary);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--text-primary);
  margin: 1.2em 0 0.6em;
  line-height: 1.3;
  font-weight: 600;
}

.markdown-body :deep(h1) {
  font-size: 1.8em;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.3em;
}

.markdown-body :deep(h2) {
  font-size: 1.45em;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.25em;
}

.markdown-body :deep(h3) {
  font-size: 1.2em;
}

.markdown-body :deep(p) {
  margin: 0.8em 0;
}

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.6em;
  margin: 0.6em 0;
}

.markdown-body :deep(li) {
  margin: 0.3em 0;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--accent);
  background: var(--bg-tertiary);
  padding: 0.6em 1em;
  margin: 1em 0;
  color: var(--text-secondary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.markdown-body :deep(code) {
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--text-primary);
}

.markdown-body :deep(pre) {
  background: var(--bg-tertiary);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  border: 1px solid var(--border);
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--border);
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--bg-tertiary);
  font-weight: 600;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5em 0;
}
</style>
