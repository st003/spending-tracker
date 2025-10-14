import sqlite3 from 'sqlite3'

const CREATE_TABLE_SCHEMA_VERSIONS = `
  CREATE TABLE "Schema_Versions" (
    "id" INTEGER NOT NULL,
    "numeric_version" INTEGER NOT NULL UNIQUE,
    "semantic_version" TEXT NOT NULL UNIQUE,
    "applied_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
  );
`

const CREATE_TABLE_CATEGORIES = `
  CREATE TABLE "Categories" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL UNIQUE,
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

const INSERT_SCHEMA_VERSION = `INSERT INTO Schema_Versions (numeric_version, semantic_version) VALUES (1, '1.0.0');`
const INSERT_DEFAULT_CATEGORIES = `INSERT INTO Categories (name) VALUES ('Uncategorized');`

/**
 * Creates a new sqlite database at the given location and runs
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
        // tables
        db.run(CREATE_TABLE_SCHEMA_VERSIONS)
        db.run(CREATE_TABLE_CATEGORIES)
        db.run(CREATE_TABLE_PAYMENTS)
        // data
        db.run(INSERT_SCHEMA_VERSION)
        db.run(INSERT_DEFAULT_CATEGORIES)
      } catch (error) {
        reject(error)
      }
    })

    db.close((error) => {
      if (error) reject(error)
      resolve()
    })
  })
}
