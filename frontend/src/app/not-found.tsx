// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Big 404 Error Code */}
        <p className="text-base font-semibold text-primary">404</p>
        
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-base leading-7 text-gray-600 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. Perhaps you entered the wrong URL or the resource has been moved.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Go back to Homepage
          </Link>
          
         
        </div>
      </div>
    </main>
  );
}