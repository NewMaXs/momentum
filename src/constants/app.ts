/**
 * 应用通用常量配置
 *
 * 集中管理应用中使用的常量，便于维护和修改
 */

// ==================== 应用信息 ====================

/**
 * 应用基本信息
 */
export const APP_INFO = {
  /** 应用名称 */
  NAME: "Momentum",
  /** 应用版本 */
  VERSION: "1.0.0",
  /** 应用描述 */
  DESCRIPTION: "专注与效率管理应用",
} as const;

// ==================== 动画配置 ====================

/**
 * 全局动画时长配置（毫秒）
 */
export const ANIMATION_DURATION = {
  /** 快速动画 */
  FAST: 150,
  /** 正常动画 */
  NORMAL: 300,
  /** 慢速动画 */
  SLOW: 500,
  /** 超慢动画 */
  EXTRA_SLOW: 800,
} as const;

/**
 * 动画缓动函数配置
 */
export const ANIMATION_EASING = {
  /** 线性 */
  LINEAR: "linear",
  /** 缓入缓出 */
  EASE_IN_OUT: "easeInOut",
  /** 缓出 */
  EASE_OUT: "easeOut",
  /** 缓入 */
  EASE_IN: "easeIn",
} as const;

// ==================== 布局常量 ====================

/**
 * 间距常量
 */
export const SPACING = {
  /** 超小间距 */
  XS: 4,
  /** 小间距 */
  SM: 8,
  /** 中等间距 */
  MD: 16,
  /** 大间距 */
  LG: 24,
  /** 超大间距 */
  XL: 32,
  /** 特大间距 */
  XXL: 48,
} as const;

/**
 * 圆角常量
 */
export const BORDER_RADIUS = {
  /** 小圆角 */
  SM: 8,
  /** 中等圆角 */
  MD: 16,
  /** 大圆角 */
  LG: 24,
  /** 超大圆角 */
  XL: 28,
  /** 完全圆形 */
  FULL: 9999,
} as const;

/**
 * 图标尺寸
 */
export const ICON_SIZE = {
  /** 小图标 */
  SM: 16,
  /** 中等图标 */
  MD: 24,
  /** 大图标 */
  LG: 32,
  /** 超大图标 */
  XL: 48,
  /** 特大图标 */
  XXL: 96,
} as const;

// ==================== 存储键名 ====================

/**
 * AsyncStorage 键名
 */
export const STORAGE_KEYS = {
  /** 主题模式 */
  THEME_MODE: "themeMode",
  /** 用户首选项 */
  USER_PREFERENCES: "userPreferences",
  /** 应用数据 */
  APP_DATA: "appData",
  /** 首次启动标记 */
  FIRST_LAUNCH: "firstLaunch",
} as const;

// ==================== 时间常量 ====================

/**
 * 时间常量（毫秒）
 */
export const TIME = {
  /** 1 秒 */
  SECOND: 1000,
  /** 1 分钟 */
  MINUTE: 60 * 1000,
  /** 1 小时 */
  HOUR: 60 * 60 * 1000,
  /** 1 天 */
  DAY: 24 * 60 * 60 * 1000,
} as const;

// ==================== 调试配置 ====================

/**
 * 调试配置
 */
export const DEBUG = {
  /** 是否启用日志 */
  ENABLE_LOGGING: __DEV__,
  /** 是否显示性能监控 */
  ENABLE_PERFORMANCE_MONITORING: __DEV__,
} as const;

// ==================== 默认值 ====================

/**
 * 默认配置值
 */
export const DEFAULTS = {
  /** 默认主题模式 */
  THEME_MODE: "system" as const,
  /** 默认语言 */
  LANGUAGE: "zh-CN" as const,
} as const;
