import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isRawJwt(value: string) {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value

  if (token && isRawJwt(token)) {
    return NextResponse.next()
  }

  const cms = NextResponse.redirect(new URL('/cms', request.url))
  if (token) cms.cookies.delete('payload-token')
  return cms
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
