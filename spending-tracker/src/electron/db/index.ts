import fs from 'fs'

import { app } from 'electron'
import log from 'electron-log/main.js'

import createNewDatabase from './schema/base.js'

// TODO: make these configurable
const DATABASE_NAME = 'data.db'
const MAX_BACKUPS = 10;

/**
 * Global location of database path
 */
export var DB: string

/**
 * Initiates the database path
 */
export async function initDatabase() {

  if (process.env.NODE_ENV === 'development') {
    DB = DATABASE_NAME
  } else {
    const userDataDir = app.getPath('userData')
    DB = `${userDataDir}/${DATABASE_NAME}`
  }

  if (!fs.existsSync(DB)) {
    log.info('Database does not exist. Creating new one...')
    await createNewDatabase(DB)
  }
}

/**
 * Creates the database backup directory if not available
 *
 * @param backupDirPath full path (including directory name) for the location to save backups
 * @returns 
 */
function initBackupLocation(backupDirPath: string): Promise<void> {
  return new Promise((resolve, reject) => {

    if (!fs.existsSync(backupDirPath)) {
      fs.mkdir(backupDirPath, (error) => {
        if (error) reject(error)
        else resolve()
      })
    } else {
      resolve()
    }
  })
}

/**
 * Generates a timestamped filename for a new database backup.
 *
 * @returns The name of the backup file to be created
 */
function getBackupFileName(): string {
  const dt = new Date()

  const timestamp = String(dt.getUTCFullYear())
    + String(dt.getUTCMonth())
    + String(dt.getUTCDay())
    + String(dt.getUTCHours())
    + String(dt.getUTCMinutes())
    + String(dt.getUTCSeconds())
    + String(dt.getUTCMilliseconds())

  return `data-${timestamp}.db`
}

/**
 * Creates a new backup of the current database and purges
 * old backups
 */
export async function backupDatabase(): Promise<void> {

  // TODO: make this prod only

  const userDataDir = app.getPath('userData')
  const backupDir = `${userDataDir}/database_backups`

  await initBackupLocation(backupDir)

  if (fs.existsSync(DB)) {
    const backupFileName = getBackupFileName()
    const backupFilePath = `${backupDir}/${backupFileName}`
    fs.copyFileSync(DB, backupFilePath)
    log.info(`Backed up database to: ${backupFilePath}`)

  } else {
    throw new Error('Unable to locate database')
  }

  // purge excess backups
  const existingBackups = fs.readdirSync(backupDir)
  if (existingBackups.length > MAX_BACKUPS) {

    const backupsToDelete = existingBackups
      .map(name => {
        const path = `${backupDir}/${name}`
        return {
          path,
          modifiedDate: fs.statSync(path).mtimeMs
        }
      })
      .sort((a, b) => b.modifiedDate - a.modifiedDate)
      .slice(MAX_BACKUPS) // keep the N most recent

      for (const backup of backupsToDelete) {
        try {
          fs.unlinkSync(backup.path)
          log.info(`Deleted backup: ${backup.path}`)
        } catch (error) {
          log.error(`Unable to delete backup: ${backup.path}`, error)
        }
      }
  }
}
