import { marked } from 'marked'
import { createLogger } from '../utils/logger.js'
import { createError, ERROR_CODES } from '../utils/errors.js'
import { EXPORT_FORMATS, NOTE_PLACEHOLDER_TITLE } from '../constants/index.js'

const log = createLogger('ExportService')

marked.setOptions({ breaks: true, gfm: true })

const toHtmlDocument = (note) => {
    const body = marked.parse(note.content || '')
    const title = note.title || NOTE_PLACEHOLDER_TITLE
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #222; line-height: 1.7; }
pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; }
code { font-family: "SFMono-Regular", Consolas, monospace; }
blockquote { border-left: 4px solid #ddd; padding-left: 12px; color: #666; margin: 0; }
img { max-width: 100%; }
</style>
</head>
<body>
${body}
</body>
</html>`
}

const triggerDownload = (blob, filename) => {
    try {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        log.info('download triggered', { filename })
    } catch (err) {
        log.error('download failed', { err: err.message })
        throw createError(ERROR_CODES.FILE_DOWNLOAD_FAIL, err)
    }
}

const buildFilename = (title, extension) => {
    const safeTitle = (title || NOTE_PLACEHOLDER_TITLE).replace(/[\\/:*?"<>|]/g, '_')
    return `${safeTitle}.${extension}`
}

export const exportService = {
    exportAs(note, format) {
        try {
            if (format === EXPORT_FORMATS.TXT) {
                const blob = new Blob([note.content || ''], { type: 'text/plain;charset=utf-8' })
                triggerDownload(blob, buildFilename(note.title, 'txt'))
                return
            }
            if (format === EXPORT_FORMATS.HTML) {
                const html = toHtmlDocument(note)
                const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
                triggerDownload(blob, buildFilename(note.title, 'html'))
                return
            }
            throw createError(ERROR_CODES.INVALID_ARGUMENT)
        } catch (err) {
            log.error('export failed', { format, err: err.message })
            if (err.code) throw err
            throw createError(ERROR_CODES.EXPORT_FAIL, err)
        }
    }
}
