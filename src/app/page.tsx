export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-100">
      <section className="w-full max-w-xl px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Mystery Message
        </h1>

        <p className="mt-4 text-neutral-400">
          A private, authenticated messaging platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/sign-in"
            className="rounded-md bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition"
          >
            Sign in
          </a>

          <a
            href="/sign-up"
            className="rounded-md border border-neutral-700 px-5 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-900 transition"
          >
            Sign up
          </a>
        </div>
      </section>
    </main>
  );
}

