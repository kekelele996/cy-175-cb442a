import { describe, it, expect } from 'vitest'
import { searchService } from './search.js'

const mockNotes = [
    { id: '1', title: 'Vue 3 入门', content: '# Vue 3 入门\n\n这是一篇关于 Vue 的笔记', tags: ['tag-vue', 'tag-js'] },
    { id: '2', title: 'React Hooks 深入', content: '# React Hooks\n\nuseState 和 useEffect', tags: ['tag-react', 'tag-js'] },
    { id: '3', title: '生活随笔', content: '# 今天天气真好\n\n出去散步了，记录了一些笔记', tags: ['tag-life'] },
    { id: '4', title: '', content: '无标题的一些想法', tags: [] }
]

describe('searchService.filter', () => {
    describe('无筛选条件', () => {
        it('无关键字无标签时返回全部笔记', () => {
            const result = searchService.filter(mockNotes, {})
            expect(result).toHaveLength(4)
        })

        it('空关键字和空标签数组返回全部', () => {
            const result = searchService.filter(mockNotes, { keyword: '', tagIds: [] })
            expect(result).toHaveLength(4)
        })
    })

    describe('关键字搜索', () => {
        it('应在标题中匹配关键字', () => {
            const result = searchService.filter(mockNotes, { keyword: 'Vue' })
            expect(result).toHaveLength(1)
            expect(result[0].id).toBe('1')
        })

        it('应在内容中匹配关键字', () => {
            const result = searchService.filter(mockNotes, { keyword: 'useEffect' })
            expect(result).toHaveLength(1)
            expect(result[0].id).toBe('2')
        })

        it('应大小写不敏感', () => {
            const result = searchService.filter(mockNotes, { keyword: 'vue' })
            expect(result).toHaveLength(1)
            expect(result[0].id).toBe('1')
        })

        it('应在标题和内容中同时搜索', () => {
            const result = searchService.filter(mockNotes, { keyword: '笔记' })
            expect(result).toHaveLength(2)
            expect(result.map(n => n.id).sort()).toEqual(['1', '3'])
        })

        it('无匹配时返回空数组', () => {
            const result = searchService.filter(mockNotes, { keyword: '不存在的关键词' })
            expect(result).toHaveLength(0)
        })

        it('关键字长度为0时不进行关键字过滤', () => {
            const result = searchService.filter(mockNotes, { keyword: '' })
            expect(result).toHaveLength(4)
        })
    })

    describe('标签筛选', () => {
        it('应按单个标签筛选', () => {
            const result = searchService.filter(mockNotes, { tagIds: ['tag-js'] })
            expect(result).toHaveLength(2)
            expect(result.map(n => n.id).sort()).toEqual(['1', '2'])
        })

        it('应按多个标签取交集', () => {
            const result = searchService.filter(mockNotes, { tagIds: ['tag-js', 'tag-vue'] })
            expect(result).toHaveLength(1)
            expect(result[0].id).toBe('1')
        })

        it('无匹配标签时返回空', () => {
            const result = searchService.filter(mockNotes, { tagIds: ['tag-nonexist'] })
            expect(result).toHaveLength(0)
        })

        it('标签为 null 时不进行标签过滤', () => {
            const result = searchService.filter(mockNotes, { keyword: '', tagIds: null })
            expect(result).toHaveLength(4)
        })
    })

    describe('关键字 + 标签组合', () => {
        it('应同时满足关键字和标签条件', () => {
            const result = searchService.filter(mockNotes, { keyword: 'Hooks', tagIds: ['tag-react'] })
            expect(result).toHaveLength(1)
            expect(result[0].id).toBe('2')
        })

        it('关键字匹配但标签不匹配时返回空', () => {
            const result = searchService.filter(mockNotes, { keyword: 'Vue', tagIds: ['tag-react'] })
            expect(result).toHaveLength(0)
        })
    })
})
