import { createLogger } from '../utils/logger.js'
import { SEARCH_MIN_LENGTH } from '../constants/index.js'

const log = createLogger('SearchService')

const normalize = (text) => String(text || '').toLowerCase()

export const searchService = {
    filter(notes, { keyword = '', tagIds = [] } = {}) {
        const normalizedKeyword = normalize(keyword)
        const hasKeyword = normalizedKeyword.length >= SEARCH_MIN_LENGTH
        const hasTags = Array.isArray(tagIds) && tagIds.length > 0

        log.debug('filter invoked', { keywordLength: normalizedKeyword.length, tagCount: Array.isArray(tagIds) ? tagIds.length : 0 })

        return notes.filter((note) => {
            const matchKeyword = !hasKeyword
                || normalize(note.title).includes(normalizedKeyword)
                || normalize(note.content).includes(normalizedKeyword)
            const matchTags = !hasTags || tagIds.every((tagId) => (note.tags || []).includes(tagId))
            return matchKeyword && matchTags
        })
    }
}
