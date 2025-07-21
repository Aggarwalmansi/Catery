// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { db, initDB } from '@/lib/db'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  await initDB()

  const existingUser = db.data!.users.find((user) => user.email === email)

  if (existingUser) {
    return NextResponse.json({ success: false, message: 'User already exists' })
  }

  db.data!.users.push({ email, password })
  await db.write()

  return NextResponse.json({ success: true, message: 'Registration successful' })
}
