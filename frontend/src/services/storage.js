import { STORAGE_KEYS } from '../constants/index.js'
import { createLogger } from '../utils/logger.js'
import { createError, ERROR_CODES } from '../utils/errors.js'

const log = createLogger('StorageService')

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const readJSON = (key) => {
    if (!isBrowser()) return null
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : null
    } catch (err) {
        log.error('readJSON failed', { key, err: err.message })
        throw createError(ERROR_CODES.STORAGE_READ_FAIL, err)
    }
}

const writeJSON = (key, value) => {
    if (!isBrowser()) return
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
        log.error('writeJSON failed', { key, err: err.message })
        throw createError(ERROR_CODES.STORAGE_WRITE_FAIL, err)
    }
}

const readString = (key) => {
    if (!isBrowser()) return null
    try {
        return localStorage.getItem(key)
    } catch (err) {
        log.error('readString failed', { key, err: err.message })
        return null
    }
}

const writeString = (key, value) => {
    if (!isBrowser()) return
    try {
        localStorage.setItem(key, value)
    } catch (err) {
        log.error('writeString failed', { key, err: err.message })
    }
}

const removeKey = (key) => {
    if (!isBrowser()) return
    try {
        localStorage.removeItem(key)
    } catch (err) {
        log.error('removeKey failed', { key, err: err.message })
    }
}

export const storage = {
    loadNotes() {
        return readJSON(STORAGE_KEYS.NOTES) || []
    },
    saveNotes(notes) {
        writeJSON(STORAGE_KEYS.NOTES, notes)
    },
    loadTags() {
        return readJSON(STORAGE_KEYS.TAGS) || []
    },
    saveTags(tags) {
        writeJSON(STORAGE_KEYS.TAGS, tags)
    },
    loadSettings() {
        return readJSON(STORAGE_KEYS.SETTINGS) || {}
    },
    saveSettings(settings) {
        writeJSON(STORAGE_KEYS.SETTINGS, settings)
    },
    loadActiveNoteId() {
        return readString(STORAGE_KEYS.ACTIVE_NOTE_ID)
    },
    saveActiveNoteId(id) {
        if (id) writeString(STORAGE_KEYS.ACTIVE_NOTE_ID, id)
        else removeKey(STORAGE_KEYS.ACTIVE_NOTE_ID)
    }
}
