/**
 * Logger utility for main process
 * Provides consistent logging across the application
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

class Logger {
  constructor(context = 'ZFCocteles') {
    this.context = context;
  }

  log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${this.context}]`;

    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(prefix, message, ...args);
        break;
      case LOG_LEVELS.WARN:
        console.warn(prefix, message, ...args);
        break;
      case LOG_LEVELS.INFO:
        console.info(prefix, message, ...args);
        break;
      case LOG_LEVELS.DEBUG:
        console.log(prefix, message, ...args);
        break;
      default:
        console.log(prefix, message, ...args);
    }
  }

  error(message, ...args) {
    this.log(LOG_LEVELS.ERROR, message, ...args);
  }

  warn(message, ...args) {
    this.log(LOG_LEVELS.WARN, message, ...args);
  }

  info(message, ...args) {
    this.log(LOG_LEVELS.INFO, message, ...args);
  }

  debug(message, ...args) {
    this.log(LOG_LEVELS.DEBUG, message, ...args);
  }
}

export default Logger;
