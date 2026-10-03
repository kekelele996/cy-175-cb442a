import { ref, watch } from 'vue'
import { themeService } from '../services/theme.js'

const themeId = ref(null)
const mode = ref(null)
let initialized = false

export const useTheme = () => {
  const init = () => {
    if (initialized) return
    const settings = themeService.loadSettings()
    themeId.value = settings.themeId
    mode.value = settings.mode
    themeService.applyToRoot(themeId.value, mode.value)
    initialized = true
  }

  init()

  const setTheme = (id) => {
    themeId.value = id
    themeService.applyToRoot(id, mode.value)
    themeService.saveSettings(id, mode.value)
  }

  const toggleMode = () => {
    const next = mode.value === 'dark' ? 'light' : 'dark'
    mode.value = next
    themeService.applyToRoot(themeId.value, next)
    themeService.saveSettings(themeId.value, next)
  }

  const setMode = (next) => {
    mode.value = next
    themeService.applyToRoot(themeId.value, next)
    themeService.saveSettings(themeId.value, next)
  }

  watch([themeId, mode], () => {
    themeService.saveSettings(themeId.value, mode.value)
  })

  return {
    themeId,
    mode,
    themes: themeService.listThemes(),
    setTheme,
    setMode,
    toggleMode
  }
}
