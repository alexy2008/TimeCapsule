/**
 * 应用配置
 * 从环境变量读取配置，提供默认值
 */

// 服务端口
export const PORT = parseInt(process.env.PORT || "8080");

// 数据库路径：使用相对于项目根目录的路径
export const DATABASE_URL = process.env.DATABASE_URL || "../../data/hellotime.db";

// 管理员密码
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "timecapsule-admin";

// JWT 密钥
export const JWT_SECRET = process.env.JWT_SECRET || "hellotime-jwt-secret-key-that-is-long-enough-for-hs256";

// JWT 过期时间（小时）
export const JWT_EXPIRATION_HOURS = parseInt(process.env.JWT_EXPIRATION_HOURS || "2");
