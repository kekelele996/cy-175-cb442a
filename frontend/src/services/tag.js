import { generateId } from '../utils/id.js'
import { TAG_MAX_LENGTH, TAG_MAX_COUNT_PER_NOTE } from '../constants/index.js'
import { createLogger } from '../utils/logger.js'
import { createError, ERROR_CODES } from '../utils/errors.js'
import { storage } from './storage.js'

const log = createLogger('TagService')

const readAll = () => storage.loadTags()

const writeAll = (tags) => storage.saveTags(tags)

const normalize = (name) => String(name || '').trim()

export const tagService = {
    listAll() {
        return readAll()
    },

    create(name) {
        const normalized = normalize(name)
        if (!normalized) throw createError(ERROR_CODES.INVALID_ARGUMENT)
        if (normalized.length > TAG_MAX_LENGTH) throw createError(ERROR_CODES.TAG_TOO_LONG)
        const tags = readAll()
        if (tags.some((tag) => tag.name === normalized)) {
            return tags.find((tag) => tag.name === normalized)
        }
        const tag = { id: generateId(), name: normalized, createdAt: Date.now() }
        tags.push(tag)
        writeAll(tags)
        log.info('tag created', { id: tag.id, name: tag.name })
        return tag
    },

    remove(id) {
        const tags = readAll().filter((tag) => tag.id !== id)
        writeAll(tags)
        log.info('tag removed', { id })
    },

    ensureLimit(count) {
        if (count > TAG_MAX_COUNT_PER_NOTE) {
            throw createError(ERROR_CODES.TAG_LIMIT_EXCEEDED)
        }
    }
}
