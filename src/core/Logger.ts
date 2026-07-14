import { EventBus } from './EventBus';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const ENABLED: Record<LogLevel, boolean> = {
  info: true,
  warn: true,
  error: true,
  debug: false,
};

export class Logger {
  private static readonly PREFIX = '[VBook]';

  static info(source: string, message: string, ...args: unknown[]): void {
    if (!ENABLED.info) return;
    console.info(`${this.PREFIX}[${source}] ${message}`, ...args);
  }

  static warn(source: string, message: string, ...args: unknown[]): void {
    if (!ENABLED.warn) return;
    console.warn(`${this.PREFIX}[${source}] ${message}`, ...args);
  }

  static error(source: string, message: string, error?: unknown): void {
    if (!ENABLED.error) return;
    console.error(`${this.PREFIX}[${source}] ${message}`, error ?? '');
    EventBus.emit('error:occurred', { source, message, error });
  }

  static debug(source: string, message: string, ...args: unknown[]): void {
    if (!ENABLED.debug) return;
    console.debug(`${this.PREFIX}[${source}] ${message}`, ...args);
  }
}
