import { generateId } from '../utils/id.js'
import { NOTE_TEMPLATE } from '../constants/index.js'
import { createLogger } from '../utils/logger.js'
import { storage } from './storage.js'

const log = createLogger('NoteService')

const readAll = () => storage.loadNotes()

const writeAll = (notes) => storage.saveNotes(notes)

const sortByUpdated = (notes) => [...notes].sort((a, b) => b.updatedAt - a.updatedAt)

export const noteService = {
    listAll() {
        return sortByUpdated(readAll())
    },

    getById(id) {
        return readAll().find((note) => note.id === id) || null
    },

    create(initialContent = NOTE_TEMPLATE) {
        const now = Date.now()
        const note = {
            id: generateId(),
            title: '',
            content: initialContent,
            tags: [],
            createdAt: now,
            updatedAt: now
        }
        const notes = readAll()
        notes.push(note)
        writeAll(notes)
        log.info('note created', { id: note.id })
        return note
    },

    update(id, patch) {
        const notes = readAll()
        const index = notes.findIndex((note) => note.id === id)
        if (index === -1) return null
        notes[index] = {
            ...notes[index],
            ...patch,
            id,
            updatedAt: Date.now()
        }
        writeAll(notes)
        log.info('note updated', { id })
        return notes[index]
    },

    remove(id) {
        const notes = readAll().filter((note) => note.id !== id)
        writeAll(notes)
        log.info('note removed', { id })
    },

    deriveTitle(note) {
        if (!note || !note.content) return ''
        const firstLine = note.content.split('\n').find((line) => line.trim().length > 0) || ''
        return firstLine.replace(/^#+\s*/, '').trim()
    }
}
