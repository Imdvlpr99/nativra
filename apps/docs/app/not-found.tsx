import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50">404</h1>
        <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
          Page not found
        </p>
      </div>

      <p className="mb-8 max-w-md text-zinc-600 dark:text-zinc-400">
        The page you're looking for doesn't exist. Head back to the documentation to continue.
      </p>

      <Link
        href="/docs"
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
      >
        Back to Docs
      </Link>
    </main>
  );
}
