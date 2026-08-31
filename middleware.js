import { NextResponse } from "next/server";

export function middleware(request) {
    const userAgent = request.headers.get("user-agent") || "";

    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);

    if (isMobile) {
        return NextResponse.rewrite(
            new URL("/mobile.html", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/downloads",
        "/updates",
        "/index.html",
        "/downloads.html",
        "/updates.html"
    ]
};