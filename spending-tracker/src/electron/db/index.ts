import fs from 'fs'

import { app } from 'electron'
import log from 'electron-log/main.js'

import createNewDatabase from './schema/base.js'

/**
 * Global location of database path
 */
export var DB: string // TODO: make this a default export

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

/**
 * Creates the database backup directory if not available
 */
function initBackupLocation(): Promise<void> {
  return new Promise((resolve, reject) => {

    const userDataDir = app.getPath('userData')
    const backupDir = `${userDataDir}/database_backups`

    if (!fs.existsSync(backupDir)) {
      fs.mkdir(backupDir, (error) => {
        if (error) reject(error)
        else resolve()
      })
    } else {
      resolve()
    }
  })
}

/**
 * Creates a new backup of the current database
 */
export async function backupDatabase(): Promise<void> {
  // TODO: make this prod only
  await initBackupLocation()
}
