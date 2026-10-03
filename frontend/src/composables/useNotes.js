import { ref, computed, watch } from 'vue'
import { noteService } from '../services/note.js'
import { tagService } from '../services/tag.js'
import { searchService } from '../services/search.js'
import { storage } from '../services/storage.js'
import { createLogger } from '../utils/logger.js'
import { AUTO_SAVE_DELAY } from '../constants/index.js'

const log = createLogger('useNotes')

const notes = ref([])
const tags = ref([])
const activeNoteId = ref(null)
const keyword = ref('')
const selectedTagIds = ref([])

let autoSaveTimer = null

const loadAll = () => {
    notes.value = noteService.listAll()
    tags.value = tagService.listAll()
    const savedId = storage.loadActiveNoteId()
    if (savedId && notes.value.some((note) => note.id === savedId)) {
        activeNoteId.value = savedId
    } else if (notes.value.length > 0) {
        activeNoteId.value = notes.value[0].id
    }
}

const scheduleAutoSave = (note) => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(() => {
        const title = noteService.deriveTitle(note)
        noteService.update(note.id, { content: note.content, title })
        notes.value = noteService.listAll()
        log.debug('autosave fired', { id: note.id })
    }, AUTO_SAVE_DELAY)
}

const activeNote = computed(() =>
    notes.value.find((note) => note.id === activeNoteId.value) || null
)

const filteredNotes = computed(() =>
    searchService.filter(notes.value, { keyword: keyword.value, tagIds: selectedTagIds.value })
)

watch(activeNoteId, (id) => {
    storage.saveActiveNoteId(id)
})

export const useNotes = () => {
    if (notes.value.length === 0 && tags.value.length === 0) {
        loadAll()
    }

    const createNote = () => {
        const note = noteService.create()
        notes.value = noteService.listAll()
        activeNoteId.value = note.id
        return note
    }

    const selectNote = (id) => {
        activeNoteId.value = id
    }

    const updateContent = (content) => {
        if (!activeNote.value) return
        activeNote.value.content = content
        scheduleAutoSave(activeNote.value)
    }

    const deleteNote = (id) => {
        noteService.remove(id)
        notes.value = noteService.listAll()
        if (activeNoteId.value === id) {
            activeNoteId.value = notes.value.length > 0 ? notes.value[0].id : null
        }
    }

    const addTagToActive = (name) => {
        if (!activeNote.value) return null
        tagService.ensureLimit((activeNote.value.tags || []).length + 1)
        const tag = tagService.create(name)
        if (!activeNote.value.tags.includes(tag.id)) {
            activeNote.value.tags = [...(activeNote.value.tags || []), tag.id]
            noteService.update(activeNote.value.id, { tags: activeNote.value.tags })
            notes.value = noteService.listAll()
        }
        tags.value = tagService.listAll()
        return tag
    }

    const removeTagFromActive = (tagId) => {
        if (!activeNote.value) return
        activeNote.value.tags = (activeNote.value.tags || []).filter((id) => id !== tagId)
        noteService.update(activeNote.value.id, { tags: activeNote.value.tags })
        notes.value = noteService.listAll()
    }

    const toggleTagFilter = (tagId) => {
        const index = selectedTagIds.value.indexOf(tagId)
        if (index === -1) selectedTagIds.value.push(tagId)
        else selectedTagIds.value.splice(index, 1)
    }

    const clearFilters = () => {
        keyword.value = ''
        selectedTagIds.value = []
    }

    const deleteTagGlobal = (tagId) => {
        tagService.remove(tagId)
        tags.value = tagService.listAll()
        notes.value.forEach((note) => {
            if ((note.tags || []).includes(tagId)) {
                note.tags = note.tags.filter((id) => id !== tagId)
                noteService.update(note.id, { tags: note.tags })
            }
        })
        notes.value = noteService.listAll()
        selectedTagIds.value = selectedTagIds.value.filter((id) => id !== tagId)
    }

    return {
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
        clearFilters,
        deleteTagGlobal
    }
}
