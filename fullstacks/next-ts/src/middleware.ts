import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_COOKIE_NAME = 'admin_token'
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hellotime-next-fullstack-secret')

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.next()
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.role !== 'admin') {
      throw new Error('invalid role')
    }
    return NextResponse.next()
  } catch {
    const response = NextResponse.next()
    response.cookies.delete(ADMIN_COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
