import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="label text-signal">404 — Frame not found</p>
      <h1 className="display mt-6 text-[clamp(3.5rem,12vw,11rem)] text-bone">
        Lost in
        <br />
        the edit.
      </h1>
      <p className="mt-6 max-w-md text-lg text-bone/75">This page doesn&apos;t exist, or it was cut in a later version.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="label bg-bone px-6 py-4 text-ink transition-colors hover:bg-signal">
          Back to home
        </Link>
        <Link href="/work" className="label border border-bone/40 px-6 py-4 text-bone transition-colors hover:border-bone">
          See all work
        </Link>
      </div>
    </div>
  );
}
