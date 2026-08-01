import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="centered-state">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <Link className="button button-primary" href="/en">
        Return home
      </Link>
    </main>
  );
}
