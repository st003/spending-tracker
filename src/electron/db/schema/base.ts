import sqlite3 from 'sqlite3'

const CREATE_TABLE_CATEGORIES = `
  CREATE TABLE Categories (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id AUTOINCREMENT)
  );
`

const CREATE_TABLE_PAYMENTS = `
  CREATE TABLE Payment" (
    id INTEGER NOT NULL,
    payment_date TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    note TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id AUTOINCREMENT),
    FOREIGN KEY(category_id) REFERENCES Categories(id)
  );
`

export default function createNewDatabase(dbPath: string) {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(dbPath, error => {
      if (error) reject(error)
    })

    db.serialize(() => {
      // TODO: improve error handling here
      db.run(CREATE_TABLE_CATEGORIES)
      db.run(CREATE_TABLE_PAYMENTS)
    })

    db.close()
    resolve
  })
}
