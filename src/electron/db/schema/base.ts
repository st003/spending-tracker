import sqlite3 from 'sqlite3'

const CREATE_TABLE_CATEGORIES = `
  CREATE TABLE "Categories" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
  );
`

const CREATE_TABLE_PAYMENTS = `
  CREATE TABLE "Payments" (
    "id" INTEGER NOT NULL,
    "payment_date" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT),
    FOREIGN KEY("category_id") REFERENCES "Categories"("id")
  );
`

/**
 * Creates a new Sqlite database at the given location and runs
 * the initial create table scripts.
 *
 * @param dbPath Location to create new Sqlite database
 * @returns An empty Promise
 */
export default function createNewDatabase(dbPath: string): Promise<void> {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(dbPath, error => {
      if (error) reject(error)
    })

    db.serialize(() => {
      try {
        db.run(CREATE_TABLE_CATEGORIES)
        db.run(CREATE_TABLE_PAYMENTS)
      } catch (error) {
        reject(error)
      }
    })

    db.close()
    resolve()
  })
}
