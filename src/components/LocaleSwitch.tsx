'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface LocaleSwitchProps {
  readonly targetLocale: 'en' | 'es';
  readonly label: string;
  readonly className?: string | undefined;
}

/**
 * Language switch that keeps the visitor on the page they are reading:
 * /en/assessment becomes /es/assessment, query preserved. Every routed page
 * is locale-mirrored, so no fallback mapping is needed; an unexpected path
 * still lands on the target locale's root.
 */
export default function LocaleSwitch({ targetLocale, label, className }: LocaleSwitchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname.split('/');
  let href = `/${targetLocale}`;
  if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'es')) {
    segments[1] = targetLocale;
    href = segments.join('/') || `/${targetLocale}`;
  }
  const query = searchParams.toString();

  return (
    <Link className={className} href={query ? `${href}?${query}` : href}>
      {label}
    </Link>
  );
}
