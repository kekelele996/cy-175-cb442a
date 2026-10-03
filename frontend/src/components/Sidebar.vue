<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="brand">随笔笔记</h1>
      <button class="btn btn-primary btn-new" @click="$emit('create')">+ 新建</button>
    </div>

    <div class="search-box">
      <input
        :value="keyword"
        @input="$emit('update:keyword', $event.target.value)"
        type="text"
        placeholder="搜索笔记内容..."
        class="search-input"
      />
    </div>

    <div class="tag-filter" v-if="tags.length > 0">
      <div class="section-label">标签筛选</div>
      <div class="tag-list">
        <button
          v-for="tag in tags"
          :key="tag.id"
          class="tag-chip"
          :class="{ active: selectedTagIds.includes(tag.id) }"
          @click="$emit('toggle-tag', tag.id)"
        >
          {{ tag.name }}
        </button>
      </div>
      <button v-if="selectedTagIds.length > 0 || keyword" class="clear-filter" @click="$emit('clear-filters')">
        清除筛选
      </button>
    </div>

    <div class="section-label note-count">共 {{ notes.length }} 条笔记</div>

    <div class="note-list">
      <div
        v-for="note in notes"
        :key="note.id"
        class="note-item"
        :class="{ active: note.id === activeNoteId }"
        @click="$emit('select', note.id)"
      >
        <div class="note-title">{{ deriveTitle(note) }}</div>
        <div class="note-snippet">{{ snippet(note.content) }}</div>
        <div class="note-meta">
          <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
          <span class="note-tags" v-if="note.tags && note.tags.length">
            <span v-for="tid in note.tags" :key="tid" class="note-tag">{{ tagName(tid) }}</span>
          </span>
        </div>
        <button class="note-delete" @click.stop="$emit('delete', note.id)" title="删除">×</button>
      </div>
      <div v-if="notes.length === 0" class="empty-state">
        还没有笔记，点击右上角「新建」开始记录吧。
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  notes: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  activeNoteId: { type: String, default: null },
  keyword: { type: String, default: '' },
  selectedTagIds: { type: Array, default: () => [] }
})

defineEmits(['create', 'select', 'delete', 'toggle-tag', 'clear-filters', 'update:keyword'])

const deriveTitle = (note) => {
  if (!note || !note.content) return '无标题笔记'
  const firstLine = note.content.split('\n').find((line) => line.trim().length > 0) || ''
  return firstLine.replace(/^#+\s*/, '').trim() || '无标题笔记'
}

const snippet = (content) => {
  const lines = (content || '').split('\n').filter((l) => l.trim())
  const rest = lines.slice(1).join(' ').replace(/[#*_`>]/g, '')
  return rest.length > 60 ? rest.slice(0, 60) + '...' : rest
}

const formatDate = (ts) => {
  const d = new Date(ts)
  const pad = (n) => (n < 10 ? '0' + n : '' + n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const tagName = (id) => {
  const found = props.tags.find((t) => t.id === id)
  return found ? found.name : ''
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.brand {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn {
  border: none;
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: 13px;
  transition: background var(--transition), color var(--transition);
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.search-box {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--transition);
}

.search-input:focus {
  border-color: var(--accent);
}

.tag-filter {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.section-label {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 12px;
  transition: all var(--transition);
}

.tag-chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.tag-chip:hover {
  border-color: var(--accent);
}

.clear-filter {
  margin-top: 8px;
  background: transparent;
  border: none;
  color: var(--accent);
  font-size: 12px;
  padding: 0;
}

.note-count {
  padding: 12px 16px 0;
}

.note-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.note-item {
  position: relative;
  padding: 10px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background var(--transition), border-color var(--transition);
}

.note-item:hover {
  background: var(--bg-tertiary);
}

.note-item.active {
  background: var(--bg-tertiary);
  border-left-color: var(--accent);
}

.note-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
  padding-right: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-snippet {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 11px;
}

.note-date {
  color: var(--text-muted);
}

.note-tags {
  display: flex;
  gap: 4px;
}

.note-tag {
  background: var(--bg-primary);
  color: var(--text-secondary);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 10px;
}

.note-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  line-height: 1;
  opacity: 0;
  transition: opacity var(--transition), color var(--transition);
}

.note-item:hover .note-delete {
  opacity: 1;
}

.note-delete:hover {
  color: #d9534f;
}

.empty-state {
  padding: 40px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
