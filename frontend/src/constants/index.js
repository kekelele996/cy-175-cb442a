export const STORAGE_KEYS = {
    NOTES: 'mnb.notes',
    TAGS: 'mnb.tags',
    ACTIVE_NOTE_ID: 'mnb.activeNoteId',
    SETTINGS: 'mnb.settings'
}

export const THEMES = {
    OCEAN: {
        id: 'ocean',
        name: '海韵',
        light: {
            '--bg-primary': '#f4f7fb',
            '--bg-secondary': '#ffffff',
            '--bg-tertiary': '#eaf1fb',
            '--text-primary': '#1a2a44',
            '--text-secondary': '#4a5c7a',
            '--text-muted': '#8a9ab5',
            '--accent': '#3a7bd5',
            '--accent-hover': '#2a63b8',
            '--border': '#d6e1f0',
            '--shadow': 'rgba(58, 123, 213, 0.08)'
        },
        dark: {
            '--bg-primary': '#0f1a2e',
            '--bg-secondary': '#17233d',
            '--bg-tertiary': '#1e2d4d',
            '--text-primary': '#e6eefc',
            '--text-secondary': '#a8b8d4',
            '--text-muted': '#6b7fa3',
            '--accent': '#5a9bff',
            '--accent-hover': '#7ab0ff',
            '--border': '#2a3d5f',
            '--shadow': 'rgba(0, 0, 0, 0.3)'
        }
    },
    FOREST: {
        id: 'forest',
        name: '林间',
        light: {
            '--bg-primary': '#f5f8f4',
            '--bg-secondary': '#ffffff',
            '--bg-tertiary': '#e8efe5',
            '--text-primary': '#1e2e1a',
            '--text-secondary': '#4a5c44',
            '--text-muted': '#84967e',
            '--accent': '#4a8a3a',
            '--accent-hover': '#3a6d2d',
            '--border': '#d4e0cf',
            '--shadow': 'rgba(74, 138, 58, 0.08)'
        },
        dark: {
            '--bg-primary': '#111a10',
            '--bg-secondary': '#1a2818',
            '--bg-tertiary': '#223320',
            '--text-primary': '#e8f2e6',
            '--text-secondary': '#a8c0a3',
            '--text-muted': '#6e8868',
            '--accent': '#7dc26a',
            '--accent-hover': '#9ad38a',
            '--border': '#2c3f2a',
            '--shadow': 'rgba(0, 0, 0, 0.3)'
        }
    },
    SUNSET: {
        id: 'sunset',
        name: '暮色',
        light: {
            '--bg-primary': '#fdf6f0',
            '--bg-secondary': '#ffffff',
            '--bg-tertiary': '#fbead9',
            '--text-primary': '#3a2418',
            '--text-secondary': '#6b4a34',
            '--text-muted': '#a8886c',
            '--accent': '#d9643a',
            '--accent-hover': '#b84f28',
            '--border': '#f0dcc6',
            '--shadow': 'rgba(217, 100, 58, 0.08)'
        },
        dark: {
            '--bg-primary': '#1a100c',
            '--bg-secondary': '#261812',
            '--bg-tertiary': '#33231a',
            '--text-primary': '#fbe8db',
            '--text-secondary': '#d8b49a',
            '--text-muted': '#a8866c',
            '--accent': '#ff8b5a',
            '--accent-hover': '#ffa87d',
            '--border': '#3e2c20',
            '--shadow': 'rgba(0, 0, 0, 0.3)'
        }
    },
    NIGHT: {
        id: 'night',
        name: '星夜',
        light: {
            '--bg-primary': '#f8f6fc',
            '--bg-secondary': '#ffffff',
            '--bg-tertiary': '#ece6f5',
            '--text-primary': '#1f1a3a',
            '--text-secondary': '#4a4268',
            '--text-muted': '#8880a5',
            '--accent': '#7858c8',
            '--accent-hover': '#5e42a8',
            '--border': '#dcd0ec',
            '--shadow': 'rgba(120, 88, 200, 0.08)'
        },
        dark: {
            '--bg-primary': '#0d0a1e',
            '--bg-secondary': '#18122e',
            '--bg-tertiary': '#221a40',
            '--text-primary': '#ece8f8',
            '--text-secondary': '#b4abd4',
            '--text-muted': '#7870a0',
            '--accent': '#a785f0',
            '--accent-hover': '#c2a8ff',
            '--border': '#2e2450',
            '--shadow': 'rgba(0, 0, 0, 0.3)'
        }
    }
}

export const DEFAULT_THEME_ID = THEMES.OCEAN.id

export const MODES = {
    LIGHT: 'light',
    DARK: 'dark'
}

export const DEFAULT_MODE = MODES.LIGHT

export const TOOLBAR_ACTIONS = {
    BOLD: 'bold',
    ITALIC: 'italic',
    LINK: 'link',
    IMAGE: 'image',
    CODE_BLOCK: 'code-block'
}

export const AUTO_SAVE_DELAY = 600

export const SEARCH_MIN_LENGTH = 1

export const TAG_MAX_LENGTH = 20

export const TAG_MAX_COUNT_PER_NOTE = 10

export const EXPORT_FORMATS = {
    TXT: 'txt',
    HTML: 'html'
}

export const NOTE_PLACEHOLDER_TITLE = '无标题笔记'

export const NOTE_TEMPLATE = '# 新笔记\n\n开始记录你的想法...\n'
