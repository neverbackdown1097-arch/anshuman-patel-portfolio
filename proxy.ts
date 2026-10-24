import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const slugs = new Set(projects.map((p) => p.slug));

/**
 * Case-study pages stream, so an unknown slug would otherwise answer
 * 200 + noindex. Rejecting it here gives crawlers a real 404 status.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !slugs.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }
}

export const config = { matcher: "/work/:slug" };
