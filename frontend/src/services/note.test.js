import { describe, it, expect, beforeEach, vi } from 'vitest'
import { noteService } from './note.js'
import { NOTE_TEMPLATE } from '../constants/index.js'

vi.useFakeTimers()

const { mockData, mockStorage } = vi.hoisted(() => {
    const mockData = { notes: [] }
    return {
        mockData,
        mockStorage: {
            loadNotes: vi.fn(() => mockData.notes),
            saveNotes: vi.fn((notes) => { mockData.notes = notes })
        }
    }
})

vi.mock('./storage.js', () => ({
    storage: mockStorage
}))

describe('noteService', () => {
    beforeEach(() => {
        mockData.notes = []
        mockStorage.loadNotes.mockClear()
        mockStorage.saveNotes.mockClear()
        mockStorage.loadNotes.mockImplementation(() => mockData.notes)
        mockStorage.saveNotes.mockImplementation((notes) => { mockData.notes = notes })
    })

    describe('create', () => {
        it('应使用默认模板创建笔记', () => {
            const note = noteService.create()
            expect(note.content).toBe(NOTE_TEMPLATE)
            expect(note.title).toBe('')
            expect(note.tags).toEqual([])
            expect(note.id).toBeTruthy()
            expect(note.createdAt).toBeTruthy()
            expect(note.updatedAt).toBe(note.createdAt)
            expect(mockStorage.saveNotes).toHaveBeenCalled()
        })

        it('应使用自定义内容创建笔记', () => {
            const custom = '# 我的笔记\n\n内容'
            const note = noteService.create(custom)
            expect(note.content).toBe(custom)
        })

        it('新笔记应被持久化', () => {
            noteService.create()
            expect(mockData.notes).toHaveLength(1)
        })
    })

    describe('update', () => {
        it('应更新笔记内容', () => {
            const note = noteService.create('# 旧标题')
            const updated = noteService.update(note.id, { content: '# 新标题\n\n新内容', title: '新标题' })
            expect(updated.content).toBe('# 新标题\n\n新内容')
            expect(updated.title).toBe('新标题')
            expect(updated.updatedAt).toBeGreaterThanOrEqual(note.createdAt)
        })

        it('应更新笔记标签', () => {
            const note = noteService.create()
            const updated = noteService.update(note.id, { tags: ['tag-1', 'tag-2'] })
            expect(updated.tags).toEqual(['tag-1', 'tag-2'])
        })

        it('不存在的 ID 返回 null', () => {
            const result = noteService.update('nonexistent', { content: 'x' })
            expect(result).toBeNull()
        })

        it('更新应持久化到存储', () => {
            const note = noteService.create()
            noteService.update(note.id, { content: 'updated' })
            const saved = mockData.notes.find(n => n.id === note.id)
            expect(saved.content).toBe('updated')
        })
    })

    describe('remove', () => {
        it('应删除笔记', () => {
            const note = noteService.create()
            noteService.remove(note.id)
            expect(mockData.notes).toHaveLength(0)
        })

        it('删除不存在的 ID 不抛错', () => {
            expect(() => noteService.remove('nonexistent')).not.toThrow()
        })
    })

    describe('getById', () => {
        it('应按 ID 获取笔记', () => {
            const note = noteService.create('# 特定笔记')
            const found = noteService.getById(note.id)
            expect(found).not.toBeNull()
            expect(found.content).toBe('# 特定笔记')
        })

        it('不存在的 ID 返回 null', () => {
            const result = noteService.getById('nonexistent')
            expect(result).toBeNull()
        })
    })

    describe('listAll', () => {
        it('应按 updatedAt 倒序返回', () => {
            noteService.create('# 旧笔记')
            vi.advanceTimersByTime(1000)
            noteService.create('# 新笔记')
            const list = noteService.listAll()
            expect(list[0].content).toBe('# 新笔记')
            expect(list[1].content).toBe('# 旧笔记')
        })
    })

    describe('deriveTitle', () => {
        it('应从第一行非空内容提取标题（去掉 #）', () => {
            const note = { content: '# 我的标题\n\n正文' }
            expect(noteService.deriveTitle(note)).toBe('我的标题')
        })

        it('应去掉多个 #', () => {
            const note = { content: '### 三级标题\n\n内容' }
            expect(noteService.deriveTitle(note)).toBe('三级标题')
        })

        it('跳过空行取第一行非空', () => {
            const note = { content: '\n\n\n# 标题\n' }
            expect(noteService.deriveTitle(note)).toBe('标题')
        })

        it('空内容返回空字符串', () => {
            expect(noteService.deriveTitle({ content: '' })).toBe('')
            expect(noteService.deriveTitle(null)).toBe('')
            expect(noteService.deriveTitle(undefined)).toBe('')
        })

        it('无 # 的第一行直接返回', () => {
            const note = { content: '纯文本标题\n\n内容' }
            expect(noteService.deriveTitle(note)).toBe('纯文本标题')
        })
    })
})
