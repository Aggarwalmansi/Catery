// src/lib/db.ts
import { JSONFile } from 'lowdb/node'
import { Low } from 'lowdb'

export type User = {
  email: string
  password: string
}

export type Data = {
  users: User[]
}

const file = process.cwd() + '/src/lib/db.json'
const adapter = new JSONFile<Data>(file)

// ✅ Provide default data here
const defaultData: Data = { users: [] }
export const db = new Low<Data>(adapter, defaultData)

// ✅ Utility to read and write the DB
export async function initDB() {
  await db.read()
  db.data ||= { users: [] } // in case file is empty or corrupted
  await db.write()
}
