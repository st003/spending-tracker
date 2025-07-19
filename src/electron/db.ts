import { app } from 'electron'

export var DB: string

/**
 * Initiates the database path
 */
export function initDatabase() {
  if (process.env.NODE_ENV === 'development') {
    DB = 'data.db'
  } else {
    const userDataDir = app.getPath('userData')
    DB = `${userDataDir}/data.db`
  }
}
