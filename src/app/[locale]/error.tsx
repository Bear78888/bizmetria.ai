'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Page rendering failed', { name: error.name, digest: error.digest });
  }, [error]);

  return (
    <div className="centered-state">
      <h1>Something went wrong</h1>
      <p>The request could not be completed. No sensitive details were displayed.</p>
      <button className="button button-primary" type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
