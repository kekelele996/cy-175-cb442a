import { describe, it, expect, beforeEach, vi } from 'vitest'
import { tagService } from './tag.js'
import { TAG_MAX_LENGTH, TAG_MAX_COUNT_PER_NOTE } from '../constants/index.js'

const { mockData, mockStorage } = vi.hoisted(() => {
    const mockData = { tags: [] }
    return {
        mockData,
        mockStorage: {
            loadTags: vi.fn(() => mockData.tags),
            saveTags: vi.fn((tags) => { mockData.tags = tags })
        }
    }
})

vi.mock('./storage.js', () => ({
    storage: mockStorage
}))

describe('tagService', () => {
    beforeEach(() => {
        mockData.tags = []
        mockStorage.loadTags.mockClear()
        mockStorage.saveTags.mockClear()
        mockStorage.loadTags.mockImplementation(() => mockData.tags)
    })

    describe('create', () => {
        it('应创建新标签', () => {
            const tag = tagService.create('  随笔  ')
            expect(tag.name).toBe('随笔')
            expect(tag.id).toBeTruthy()
            expect(tag.createdAt).toBeTruthy()
            expect(mockStorage.saveTags).toHaveBeenCalled()
        })

        it('重复标签应返回已存在的标签', () => {
            tagService.create('工作')
            const existing = tagService.create('  工作  ')
            expect(mockData.tags).toHaveLength(1)
            expect(existing.name).toBe('工作')
        })

        it('空名称应抛出 INVALID_ARGUMENT 错误', () => {
            expect(() => tagService.create('')).toThrow()
            expect(() => tagService.create('   ')).toThrow()
        })

        it('超长标签应抛出 TAG_TOO_LONG 错误', () => {
            const longName = 'a'.repeat(TAG_MAX_LENGTH + 1)
            expect(() => tagService.create(longName)).toThrow()
        })
    })

    describe('remove', () => {
        it('应删除指定标签', () => {
            tagService.create('待删除')
            const toDelete = mockData.tags[0]
            tagService.remove(toDelete.id)
            expect(mockData.tags).toHaveLength(0)
            expect(mockStorage.saveTags).toHaveBeenCalledWith([])
        })

        it('删除不存在的标签不报错', () => {
            expect(() => tagService.remove('nonexistent')).not.toThrow()
        })
    })

    describe('listAll', () => {
        it('应返回所有标签', () => {
            tagService.create('标签A')
            tagService.create('标签B')
            const all = tagService.listAll()
            expect(all).toHaveLength(2)
        })
    })

    describe('ensureLimit', () => {
        it('未超限不抛异常', () => {
            expect(() => tagService.ensureLimit(TAG_MAX_COUNT_PER_NOTE)).not.toThrow()
        })

        it('超限时应抛出 TAG_LIMIT_EXCEEDED 错误', () => {
            expect(() => tagService.ensureLimit(TAG_MAX_COUNT_PER_NOTE + 1)).toThrow()
        })
    })
})
