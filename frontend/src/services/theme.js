import { THEMES, MODES, DEFAULT_THEME_ID, DEFAULT_MODE } from '../constants/index.js'
import { storage } from '../services/storage.js'
import { createLogger } from '../utils/logger.js'

const log = createLogger('ThemeService')

export const themeService = {
    listThemes() {
        return Object.values(THEMES)
    },

    getTheme(id) {
        return Object.values(THEMES).find((theme) => theme.id === id) || THEMES[Object.keys(THEMES)[0]]
    },

    applyToRoot(themeId, mode) {
        const theme = this.getTheme(themeId)
        const palette = mode === MODES.DARK ? theme.dark : theme.light
        const root = document.documentElement
        Object.entries(palette).forEach(([key, value]) => {
            root.style.setProperty(key, value)
        })
        root.dataset.mode = mode
        root.dataset.theme = theme.id
        log.info('theme applied', { theme: theme.id, mode })
    },

    loadSettings() {
        const saved = storage.loadSettings()
        return {
            themeId: saved.themeId || DEFAULT_THEME_ID,
            mode: saved.mode || DEFAULT_MODE
        }
    },

    saveSettings(themeId, mode) {
        storage.saveSettings({ themeId, mode })
    }
}
