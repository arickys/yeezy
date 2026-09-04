const OFFLINE_MODE = true;

export default function middleware(request) {
    if (!OFFLINE_MODE) {
        return;
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/offline") {
        return;
    }

    if (pathname.startsWith("/api/")) {
        return;
    }

    if (pathname === "/sw.js") {
        return;
    }

    if (request.destination !== "document") {
        return;
    }

    return Response.redirect(
        new URL("/offline", request.url),
        307
    );
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
};