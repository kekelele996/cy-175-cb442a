import { describe, it, expect } from 'vitest'
import { applyToolbar } from './markdown.js'
import { TOOLBAR_ACTIONS } from '../constants/index.js'

describe('applyToolbar', () => {
    describe('加粗 (BOLD)', () => {
        it('应将选中文字用 ** 包裹', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.BOLD, 'hello world', 6, 11)
            expect(result.value).toBe('hello **world**')
            expect(result.selectionStart).toBe(8)
            expect(result.selectionEnd).toBe(13)
        })

        it('无选中时插入占位符', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.BOLD, '', 0, 0)
            expect(result.value).toBe('**粗体文本**')
            expect(result.selectionStart).toBe(2)
            expect(result.selectionEnd).toBe(6)
        })
    })

    describe('斜体 (ITALIC)', () => {
        it('应将选中文字用 * 包裹', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.ITALIC, 'hello world', 0, 5)
            expect(result.value).toBe('*hello* world')
            expect(result.selectionStart).toBe(1)
            expect(result.selectionEnd).toBe(6)
        })

        it('无选中时插入占位符', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.ITALIC, 'abc', 3, 3)
            expect(result.value).toBe('abc*斜体文本*')
            expect(result.selectionStart).toBe(4)
            expect(result.selectionEnd).toBe(8)
        })
    })

    describe('链接 (LINK)', () => {
        it('应将选中文字用 [text](url) 包裹', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.LINK, 'click here', 6, 10, { linkUrl: 'https://example.com' })
            expect(result.value).toBe('click [here](https://example.com)')
            expect(result.selectionStart).toBe(7)
            expect(result.selectionEnd).toBe(11)
        })

        it('无选中时使用默认链接文本', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.LINK, '', 0, 0, { linkUrl: 'https://x.com' })
            expect(result.value).toBe('[链接文本](https://x.com)')
        })

        it('未提供 URL 时使用默认 https://', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.LINK, 'text', 0, 4)
            expect(result.value).toBe('[text](https://)')
        })
    })

    describe('图片 (IMAGE)', () => {
        it('应插入 ![alt](url) 格式', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.IMAGE, 'post ', 5, 5, { imageUrl: 'https://img.com/a.png', imageAlt: '风景' })
            expect(result.value).toBe('post ![风景](https://img.com/a.png)')
            expect(result.selectionStart).toBe(7)
            expect(result.selectionEnd).toBe(9)
        })

        it('未提供参数时使用默认值', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.IMAGE, '', 0, 0)
            expect(result.value).toBe('![图片描述](https://)')
        })
    })

    describe('代码块 (CODE_BLOCK)', () => {
        it('应在行首插入 ``` 代码块', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.CODE_BLOCK, 'hello', 0, 0)
            expect(result.value).toContain('```\n在此输入代码\n')
        })

        it('非行首时自动补换行', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.CODE_BLOCK, 'hello', 5, 5)
            expect(result.value).toBe('hello\n```\n在此输入代码\n')
        })

        it('应将选中内容放入代码块', () => {
            const result = applyToolbar(TOOLBAR_ACTIONS.CODE_BLOCK, 'before code here', 7, 11)
            expect(result.value).toContain('```\ncode\n')
        })
    })

    describe('未知操作', () => {
        it('应返回原始文本不变', () => {
            const result = applyToolbar('unknown', 'hello', 0, 5)
            expect(result.value).toBe('hello')
            expect(result.cursor).toBe(0)
            expect(result.selectionStart).toBe(0)
            expect(result.selectionEnd).toBe(5)
        })
    })
})
