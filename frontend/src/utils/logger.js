const LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    OFF: 4
}

const LEVEL_NAMES = {
    [LEVELS.DEBUG]: 'DEBUG',
    [LEVELS.INFO]: 'INFO',
    [LEVELS.WARN]: 'WARN',
    [LEVELS.ERROR]: 'ERROR'
}

const currentLevel = () => {
    const env = import.meta.env && import.meta.env.MODE
    return env === 'production' ? LEVELS.WARN : LEVELS.DEBUG
}

const LEVEL = currentLevel()

const formatMessage = (level, tag, message, payload) => {
    const ts = new Date().toISOString()
    const prefix = `[${ts}] [${LEVEL_NAMES[level]}] [${tag}]`
    return payload !== undefined ? `${prefix} ${message} ${JSON.stringify(payload)}` : `${prefix} ${message}`
}

export const logger = {
    LEVELS,
    debug(tag, message, payload) {
        if (LEVEL > LEVELS.DEBUG) return
        console.debug(formatMessage(LEVELS.DEBUG, tag, message, payload))
    },
    info(tag, message, payload) {
        if (LEVEL > LEVELS.INFO) return
        console.info(formatMessage(LEVELS.INFO, tag, message, payload))
    },
    warn(tag, message, payload) {
        if (LEVEL > LEVELS.WARN) return
        console.warn(formatMessage(LEVELS.WARN, tag, message, payload))
    },
    error(tag, message, payload) {
        if (LEVEL > LEVELS.ERROR) return
        console.error(formatMessage(LEVELS.ERROR, tag, message, payload))
    }
}

export const createLogger = (tag) => ({
    debug: (message, payload) => logger.debug(tag, message, payload),
    info: (message, payload) => logger.info(tag, message, payload),
    warn: (message, payload) => logger.warn(tag, message, payload),
    error: (message, payload) => logger.error(tag, message, payload)
})
