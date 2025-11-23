/**
 * 日志工具类
 *
 * 提供统一的日志记录接口，在开发环境启用，生产环境禁用
 */

import { DEBUG } from "@/constants/app";

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * 日志前缀映射
 */
const LOG_PREFIXES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "🔍",
  [LogLevel.INFO]: "ℹ️",
  [LogLevel.WARN]: "⚠️",
  [LogLevel.ERROR]: "❌",
};

/**
 * 格式化时间戳
 */
function formatTimestamp(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * 格式化日志消息
 */
function formatMessage(level: LogLevel, tag: string, message: string): string {
  const timestamp = formatTimestamp();
  const prefix = LOG_PREFIXES[level];
  return `${prefix} [${timestamp}] [${level}] [${tag}] ${message}`;
}

/**
 * Logger 类
 */
class Logger {
  private enabled: boolean;
  private tag: string;

  /**
   * 创建 Logger 实例
   *
   * @param tag - 日志标签，用于标识日志来源
   * @param enabled - 是否启用日志（默认根据 DEBUG 配置）
   */
  constructor(tag: string, enabled: boolean = DEBUG.ENABLE_LOGGING) {
    this.tag = tag;
    this.enabled = enabled;
  }

  /**
   * 设置是否启用日志
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 检查是否启用
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 调试日志
   */
  debug(message: string, ...args: any[]): void {
    if (!this.enabled) return;
    const formattedMessage = formatMessage(LogLevel.DEBUG, this.tag, message);
    console.debug(formattedMessage, ...args);
  }

  /**
   * 信息日志
   */
  info(message: string, ...args: any[]): void {
    if (!this.enabled) return;
    const formattedMessage = formatMessage(LogLevel.INFO, this.tag, message);
    console.info(formattedMessage, ...args);
  }

  /**
   * 警告日志
   */
  warn(message: string, ...args: any[]): void {
    if (!this.enabled) return;
    const formattedMessage = formatMessage(LogLevel.WARN, this.tag, message);
    console.warn(formattedMessage, ...args);
  }

  /**
   * 错误日志
   */
  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (!this.enabled) return;
    const formattedMessage = formatMessage(LogLevel.ERROR, this.tag, message);

    if (error instanceof Error) {
      console.error(formattedMessage, error.message, error.stack, ...args);
    } else if (error) {
      console.error(formattedMessage, error, ...args);
    } else {
      console.error(formattedMessage, ...args);
    }
  }

  /**
   * 分组日志开始
   */
  group(label: string): void {
    if (!this.enabled) return;
    console.group(`📦 [${this.tag}] ${label}`);
  }

  /**
   * 分组日志开始（折叠）
   */
  groupCollapsed(label: string): void {
    if (!this.enabled) return;
    console.groupCollapsed(`📦 [${this.tag}] ${label}`);
  }

  /**
   * 分组日志结束
   */
  groupEnd(): void {
    if (!this.enabled) return;
    console.groupEnd();
  }

  /**
   * 表格日志
   */
  table(data: any): void {
    if (!this.enabled) return;
    console.table(data);
  }

  /**
   * 性能计时开始
   */
  time(label: string): void {
    if (!this.enabled) return;
    console.time(`⏱️ [${this.tag}] ${label}`);
  }

  /**
   * 性能计时结束
   */
  timeEnd(label: string): void {
    if (!this.enabled) return;
    console.timeEnd(`⏱️ [${this.tag}] ${label}`);
  }
}

/**
 * 创建 Logger 实例
 *
 * @param tag - 日志标签
 * @returns Logger 实例
 *
 * @example
 * ```ts
 * const logger = createLogger('MyComponent');
 * logger.info('Component mounted');
 * logger.error('Failed to load data', error);
 * ```
 */
export function createLogger(tag: string): Logger {
  return new Logger(tag);
}

/**
 * 全局默认 Logger
 */
export const logger = new Logger("App");

/**
 * 导出 Logger 类
 */
export { Logger };
