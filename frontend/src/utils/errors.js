export class AppError extends Error {
    constructor(code, message, originalError) {
        super(message)
        this.name = 'AppError'
        this.code = code
        this.originalError = originalError || null
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            original: this.originalError ? this.originalError.message : null
        }
    }
}

export const ERROR_CODES = {
    STORAGE_READ_FAIL: 'STORAGE_READ_FAIL',
    STORAGE_WRITE_FAIL: 'STORAGE_WRITE_FAIL',
    NOTE_NOT_FOUND: 'NOTE_NOT_FOUND',
    NOTE_DUPLICATE: 'NOTE_DUPLICATE',
    TAG_NOT_FOUND: 'TAG_NOT_FOUND',
    TAG_DUPLICATE: 'TAG_DUPLICATE',
    TAG_TOO_LONG: 'TAG_TOO_LONG',
    TAG_LIMIT_EXCEEDED: 'TAG_LIMIT_EXCEEDED',
    EXPORT_FAIL: 'EXPORT_FAIL',
    FILE_DOWNLOAD_FAIL: 'FILE_DOWNLOAD_FAIL',
    INVALID_ARGUMENT: 'INVALID_ARGUMENT',
    RENDER_FAIL: 'RENDER_FAIL'
}

export const ERROR_MESSAGES = {
    [ERROR_CODES.STORAGE_READ_FAIL]: '读取本地数据失败',
    [ERROR_CODES.STORAGE_WRITE_FAIL]: '写入本地数据失败',
    [ERROR_CODES.NOTE_NOT_FOUND]: '笔记不存在',
    [ERROR_CODES.NOTE_DUPLICATE]: '笔记已存在',
    [ERROR_CODES.TAG_NOT_FOUND]: '标签不存在',
    [ERROR_CODES.TAG_DUPLICATE]: '标签已存在',
    [ERROR_CODES.TAG_TOO_LONG]: '标签字符过长',
    [ERROR_CODES.TAG_LIMIT_EXCEEDED]: '单条笔记标签数量超限',
    [ERROR_CODES.EXPORT_FAIL]: '导出失败',
    [ERROR_CODES.FILE_DOWNLOAD_FAIL]: '文件下载失败',
    [ERROR_CODES.INVALID_ARGUMENT]: '参数不合法',
    [ERROR_CODES.RENDER_FAIL]: '渲染失败'
}

export const createError = (code, originalError) =>
    new AppError(code, ERROR_MESSAGES[code] || code, originalError)

export const throwError = (code, originalError) => {
    throw createError(code, originalError)
}
