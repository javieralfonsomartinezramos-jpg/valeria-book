const ENABLED = {
  info: true,
  warn: true,
  error: true,
  debug: false,
};

export class Logger {
  static PREFIX = '[VBook]';

  static info(source, message, ...args) {
    if (!ENABLED.info) return;
    console.info(`${this.PREFIX}[${source}] ${message}`, ...args);
  }

  static warn(source, message, ...args) {
    if (!ENABLED.warn) return;
    console.warn(`${this.PREFIX}[${source}] ${message}`, ...args);
  }

  static error(source, message, error) {
    if (!ENABLED.error) return;
    console.error(`${this.PREFIX}[${source}] ${message}`, error ?? '');
  }

  static debug(source, message, ...args) {
    if (!ENABLED.debug) return;
    console.debug(`${this.PREFIX}[${source}] ${message}`, ...args);
  }
}
