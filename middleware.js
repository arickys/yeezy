const REDIRECT_TO_HOME = true;

export default function middleware(request) {
    if (!REDIRECT_TO_HOME) return;

    const { pathname } = request.nextUrl;

    if (pathname === "/") return;

    if (pathname.startsWith("/api/")) return;

    return Response.redirect(new URL("/", request.url), 307);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};