// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { exportService } from './export.js'
import { EXPORT_FORMATS, NOTE_PLACEHOLDER_TITLE } from '../constants/index.js'

const mockBlob = vi.fn()
const mockCreateObjectURL = vi.fn(() => 'blob:url')
const mockRevokeObjectURL = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockClick = vi.fn()

const mockAnchor = {
    href: '',
    download: '',
    click: mockClick,
    style: {}
}

global.Blob = mockBlob
global.URL = {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL
}

document.createElement = vi.fn((tag) => {
    if (tag === 'a') return mockAnchor
    return {}
})

vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)

describe('exportService', () => {
    beforeEach(() => {
        mockBlob.mockClear()
        mockCreateObjectURL.mockClear()
        mockRevokeObjectURL.mockClear()
        mockAppendChild.mockClear()
        mockRemoveChild.mockClear()
        mockClick.mockClear()
        mockCreateObjectURL.mockReturnValue('blob:url')
    })

    describe('TXT 导出', () => {
        it('应以纯文本形式导出', () => {
            const note = { title: '测试笔记', content: '# 这是内容' }
            exportService.exportAs(note, EXPORT_FORMATS.TXT)
            expect(mockBlob).toHaveBeenCalledWith(
                ['# 这是内容'],
                { type: 'text/plain;charset=utf-8' }
            )
            expect(mockAnchor.download).toBe('测试笔记.txt')
            expect(mockClick).toHaveBeenCalled()
        })

        it('空内容时导出空 Blob', () => {
            const note = { title: '空笔记', content: '' }
            exportService.exportAs(note, EXPORT_FORMATS.TXT)
            expect(mockBlob).toHaveBeenCalledWith(
                [''],
                { type: 'text/plain;charset=utf-8' }
            )
        })

        it('标题含特殊字符时应替换为下划线', () => {
            const note = { title: '笔记/名:含*特殊?字符', content: 'x' }
            exportService.exportAs(note, EXPORT_FORMATS.TXT)
            expect(mockAnchor.download).toBe('笔记_名_含_特殊_字符.txt')
        })

        it('无标题时使用占位符', () => {
            const note = { title: '', content: 'x' }
            exportService.exportAs(note, EXPORT_FORMATS.TXT)
            expect(mockAnchor.download).toBe(`${NOTE_PLACEHOLDER_TITLE}.txt`)
        })
    })

    describe('HTML 导出', () => {
        it('应以 HTML 形式导出', () => {
            const note = { title: 'HTML笔记', content: '# 标题\n\n段落' }
            exportService.exportAs(note, EXPORT_FORMATS.HTML)
            expect(mockBlob).toHaveBeenCalled()
            const [htmlArg] = mockBlob.mock.calls[0]
            expect(htmlArg[0]).toContain('<!DOCTYPE html>')
            expect(htmlArg[0]).toContain('<title>HTML笔记</title>')
            expect(htmlArg[0]).toContain('<h1>标题</h1>')
            expect(mockAnchor.download).toBe('HTML笔记.html')
        })

        it('应包含样式', () => {
            const note = { title: '样式测试', content: '内容' }
            exportService.exportAs(note, EXPORT_FORMATS.HTML)
            const [htmlArg] = mockBlob.mock.calls[0]
            expect(htmlArg[0]).toContain('<style>')
            expect(htmlArg[0]).toContain('</style>')
        })
    })

    describe('无效格式', () => {
        it('应抛出 INVALID_ARGUMENT 错误', () => {
            const note = { title: 'x', content: 'y' }
            expect(() => exportService.exportAs(note, 'pdf')).toThrow()
        })
    })
})
