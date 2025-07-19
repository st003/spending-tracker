import fs from 'fs'

import { app } from 'electron'

import createNewDatabase from './schema/base.js'

export var DB: string

/**
 * Initiates the database path
 */
export async function initDatabase() {
  if (process.env.NODE_ENV === 'development') {
    DB = 'data.db'
    // if (!fs.existsSync(DB)) {
    //   console.log('Dev database does not exist. Creating one...')
    //   await createNewDatabase(DB)
    // }

  } else {
    const userDataDir = app.getPath('userData')
    DB = `${userDataDir}/data.db`
  }
}
