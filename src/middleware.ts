import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized: ({ req }) => Boolean(req.cookies.get("next-auth.session-token"))
  },
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - results (results/* pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets directory in /public (public static assets)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|assets|results|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}