import path from 'path'

import { app } from 'electron'

/**
 * Becuase preload scripts are injected into the frontend they will reside
 * in different locations during dev and in a package. This function dynamically
 * returns the correct path based on the current environment
 *
 * @returns The path to the preload script
 */
export function getPreloadScriptPath(): string {
  return path.join(
    app.getAppPath(),
    (process.env.NODE_ENV === 'development') ? '.' : '..',
    '/dist-electron/preload.cjs'
  )
}
