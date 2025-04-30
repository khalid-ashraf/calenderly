import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This isPublicRoute basically matches all the public routes and stores them.
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// This is used for us to block pages that are not public routes. Private routes should not be accessed without logging in and clerkMiddleware basically checks if the user is authenticated or not and based on that cross-checks with publicRoutes.

// If the user is not a protected route, the user is automatically navigated to clerk's log-in/sign-up page.
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
