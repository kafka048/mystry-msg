import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 

export async function proxy(request: NextRequest) {
    
  const token = await getToken({req: request})
  const url = request.nextUrl  

  if(token && ( 
    url.pathname.startsWith('/sign-in') || 
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') 
  
  )){

    return NextResponse.redirect(new URL('/dashboard', request.url))
    

  }    
} // this method is the middleware/proxy
 

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*', // to ensure that all the paths on the dashboard have the middleware run on them
    '/verify/:path*'

]
} // this segment defines the paths where the middleware/proxy will run

