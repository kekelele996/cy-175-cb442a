<template>
  <div class="app">
    <Sidebar
      :notes="filteredNotes"
      :tags="tags"
      :active-note-id="activeNoteId"
      :keyword="keyword"
      :selected-tag-ids="selectedTagIds"
      @create="createNote"
      @select="selectNote"
      @delete="onDeleteNote"
      @toggle-tag="toggleTagFilter"
      @clear-filters="clearFilters"
      @update:keyword="(v) => (keyword = v)"
    />

    <main class="main">
      <template v-if="activeNote">
        <Toolbar
          :mode="mode"
          :theme-id="themeId"
          :themes="themes"
          @action="onToolbarAction"
          @export="onExport"
          @toggle-mode="toggleMode"
          @change-theme="setTheme"
        />

        <TagsBar
          :active-tag-ids="activeNote.tags || []"
          :all-tags="tags"
          @add-tag="onAddTag"
          @remove-tag="onRemoveTag"
        />

        <div class="workspace">
          <Editor
            ref="editorRef"
            v-model="content"
            @apply-toolbar="onToolbarAction"
          />
          <div class="pane-divider"></div>
          <Preview :content="content" />
        </div>
      </template>
      <div v-else class="empty-state">
        <div class="empty-inner">
          <h2>📝 随笔笔记</h2>
          <p>左侧点击「新建」开始记录你的第一篇 Markdown 笔记。</p>
          <button class="btn btn-primary" @click="createNote">创建第一条笔记</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Toolbar from './components/Toolbar.vue'
import TagsBar from './components/TagsBar.vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import { useNotes } from './composables/useNotes.js'
import { useTheme } from './composables/useTheme.js'
import { applyToolbar } from './utils/markdown.js'
import { exportService } from './services/export.js'
import { createLogger } from './utils/logger.js'
import { EXPORT_FORMATS } from './constants/index.js'

const log = createLogger('App')

const {
  notes,
  tags,
  activeNoteId,
  activeNote,
  keyword,
  selectedTagIds,
  filteredNotes,
  createNote,
  selectNote,
  updateContent,
  deleteNote,
  addTagToActive,
  removeTagFromActive,
  toggleTagFilter,
  clearFilters
} = useNotes()

const { mode, themeId, themes, setTheme, toggleMode } = useTheme()

const editorRef = ref(null)
const content = ref('')

watch(
  activeNote,
  (note) => {
    content.value = note ? note.content || '' : ''
  },
  { immediate: true }
)

watch(content, (value) => {
  if (activeNote.value) updateContent(value)
})

const onToolbarAction = (action) => {
  const el = editorRef.value && editorRef.value.$el && editorRef.value.$el.querySelector('textarea')
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const result = applyToolbar(action, content.value, start, end)
  content.value = result.value
  nextTick(() => {
    if (editorRef.value && editorRef.value.setSelection) {
      editorRef.value.setSelection(result.selectionStart, result.selectionEnd)
    }
  })
}

const onExport = (format) => {
  if (!activeNote.value) return
  try {
    const snapshot = {
      ...activeNote.value,
      content: content.value
    }
    if (format === EXPORT_FORMATS.TXT) {
      exportService.exportAs(snapshot, EXPORT_FORMATS.TXT)
    } else if (format === EXPORT_FORMATS.HTML) {
      exportService.exportAs(snapshot, EXPORT_FORMATS.HTML)
    }
  } catch (err) {
    log.error('export failed', { code: err.code, message: err.message })
    alert('导出失败：' + (err.message || '未知错误'))
  }
}

const onAddTag = (name) => {
  try {
    addTagToActive(name)
  } catch (err) {
    log.warn('add tag failed', { code: err.code, message: err.message })
    alert(err.message || '添加标签失败')
  }
}

const onRemoveTag = (tagId) => {
  removeTagFromActive(tagId)
}

const onDeleteNote = (id) => {
  const note = notes.value.find((n) => n.id === id)
  const title = note ? (note.title || note.content.split('\n')[0].replace(/^#+\s*/, '') || '未命名笔记') : '此笔记'
  if (confirm(`确定要删除「${title}」吗？`)) {
    deleteNote(id)
  }
}
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-primary);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.pane-divider {
  width: 1px;
  background: var(--border);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.empty-inner {
  text-align: center;
  color: var(--text-secondary);
}

.empty-inner h2 {
  color: var(--text-primary);
  margin: 0 0 12px;
  font-weight: 600;
}

.empty-inner p {
  margin: 0 0 20px;
}

.btn {
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 20px;
  font-size: 14px;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover {
  background: var(--accent-hover);
}
</style>
