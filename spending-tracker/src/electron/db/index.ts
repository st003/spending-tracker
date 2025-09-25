import fs from 'fs'

import { app } from 'electron'
import log from 'electron-log/main.js'

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
  } else {
    const userDataDir = app.getPath('userData')
    DB = `${userDataDir}/data.db`
  }

  if (!fs.existsSync(DB)) {
    log.info('Database does not exist. Creating new one...')
    await createNewDatabase(DB)
  }
}
