<template>
  <div class="toolbar">
    <button class="tool-btn" title="加粗 (Ctrl+B)" @click="$emit('action', 'bold')">
      <strong>B</strong>
    </button>
    <button class="tool-btn" title="斜体 (Ctrl+I)" @click="$emit('action', 'italic')">
      <em>I</em>
    </button>
    <button class="tool-btn" title="链接" @click="$emit('action', 'link')">
      🔗
    </button>
    <button class="tool-btn" title="图片" @click="$emit('action', 'image')">
      🖼
    </button>
    <button class="tool-btn" title="代码块" @click="$emit('action', 'code-block')">
      &lt;/&gt;
    </button>

    <div class="toolbar-divider"></div>

    <button class="tool-btn" title="导出为纯文本" @click="$emit('export', 'txt')">
      📄 TXT
    </button>
    <button class="tool-btn" title="导出为 HTML" @click="$emit('export', 'html')">
      🌐 HTML
    </button>

    <div class="toolbar-spacer"></div>

    <div class="theme-switcher">
      <label class="mode-toggle" title="切换白天/暗黑">
        <input type="checkbox" :checked="mode === 'dark'" @change="$emit('toggle-mode')" />
        <span class="slider">
          <span class="icon">{{ mode === 'dark' ? '🌙' : '☀️' }}</span>
        </span>
      </label>

      <select class="theme-select" :value="themeId" @change="$emit('change-theme', $event.target.value)">
        <option v-for="theme in themes" :key="theme.id" :value="theme.id">
          {{ theme.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mode: { type: String, default: 'light' },
  themeId: { type: String, default: 'ocean' },
  themes: { type: Array, default: () => [] }
})

defineEmits(['action', 'export', 'toggle-mode', 'change-theme'])
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
  flex-wrap: wrap;
}

.tool-btn {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  min-width: 32px;
  transition: all var(--transition);
}

.tool-btn:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 6px;
}

.toolbar-spacer {
  flex: 1;
}

.theme-switcher {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.mode-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition);
}

.slider .icon {
  font-size: 13px;
}

.theme-select {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  font-size: 13px;
  outline: none;
}

.theme-select:focus {
  border-color: var(--accent);
}
</style>
