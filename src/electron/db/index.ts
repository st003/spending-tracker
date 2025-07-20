import fs from 'fs'

import { app } from 'electron'

import createNewDatabase from './schema/base.js'

/**
 * Global location of database path
 */
export var DB: string

/**
 * Initiates the database path
 */
export async function initDatabase() {
  if (process.env.NODE_ENV === 'development') {
    DB = 'data.db'

    if (!fs.existsSync(DB)) {
      console.warn('Development database does not exist. Creating new one...')
      await createNewDatabase(DB)
    }

  } else {
    const userDataDir = app.getPath('userData')
    DB = `${userDataDir}/data.db`
  }
}
