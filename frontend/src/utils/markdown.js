import { TOOLBAR_ACTIONS } from '../constants/index.js'

const insertAround = (text, start, end, before, after, placeholder = '') => {
  const selection = text.slice(start, end) || placeholder
  return {
    value: text.slice(0, start) + before + selection + after + text.slice(end),
    cursor: start + before.length + selection.length,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + selection.length
  }
}

const insertBlock = (text, start, end, prefix, placeholder) => {
  const needsLeadingNewline = start > 0 && text.charAt(start - 1) !== '\n'
  const selection = text.slice(start, end)
  const block = (needsLeadingNewline ? '\n' : '') + prefix + (selection || placeholder) + '\n'
  const insertAt = start
  const cursor = insertAt + block.length
  return {
    value: text.slice(0, insertAt) + block + text.slice(end),
    cursor,
    selectionStart: insertAt + prefix.length + (needsLeadingNewline ? 1 : 0),
    selectionEnd: insertAt + prefix.length + (needsLeadingNewline ? 1 : 0) + (selection || placeholder).length
  }
}

export const applyToolbar = (action, text, start, end, { linkUrl = '', imageUrl = '', imageAlt = '' } = {}) => {
  switch (action) {
    case TOOLBAR_ACTIONS.BOLD:
      return insertAround(text, start, end, '**', '**', '粗体文本')
    case TOOLBAR_ACTIONS.ITALIC:
      return insertAround(text, start, end, '*', '*', '斜体文本')
    case TOOLBAR_ACTIONS.LINK: {
      const url = linkUrl || 'https://'
      const selection = text.slice(start, end) || '链接文本'
      const wrapped = `[${selection}](${url})`
      const value = text.slice(0, start) + wrapped + text.slice(end)
      return {
        value,
        cursor: start + wrapped.length,
        selectionStart: start + 1,
        selectionEnd: start + 1 + selection.length
      }
    }
    case TOOLBAR_ACTIONS.IMAGE: {
      const url = imageUrl || 'https://'
      const alt = imageAlt || '图片描述'
      const wrapped = `![${alt}](${url})`
      const value = text.slice(0, start) + wrapped + text.slice(end)
      return {
        value,
        cursor: start + wrapped.length,
        selectionStart: start + 2,
        selectionEnd: start + 2 + alt.length
      }
    }
    case TOOLBAR_ACTIONS.CODE_BLOCK:
      return insertBlock(text, start, end, '```\n', '在此输入代码')
    default:
      return { value: text, cursor: start, selectionStart: start, selectionEnd: end }
  }
}
