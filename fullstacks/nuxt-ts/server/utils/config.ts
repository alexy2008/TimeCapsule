import path from 'node:path'

export const APP_ROOT = process.cwd()
export const DATABASE_PATH = process.env.DATABASE_PATH || path.join(APP_ROOT, 'hellotime.db')
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'timecapsule-admin'
export const JWT_SECRET = process.env.JWT_SECRET || 'hellotime-nuxt-fullstack-secret'
