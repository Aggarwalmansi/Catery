// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { db, initDB } from '@/lib/db'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  await initDB()
  if (!db.data || !Array.isArray(db.data.users)) {
      console.error("DB not initialized properly");
      return NextResponse.json({ success: false, message: 'User database not initialized' });
    }

  const user = db.data!.users.find((u) => u.email === email && u.password === password)
  if (user) {
    return NextResponse.json({ success: true, user: { email: user.email } })
  }

  return NextResponse.json({ success: false, message: 'Invalid email or password' })
}

