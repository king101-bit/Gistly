import { signUp } from '@/lib/auth-actions'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    await signUp(formData)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      },
      { status: 400 },
    )
  }
}
