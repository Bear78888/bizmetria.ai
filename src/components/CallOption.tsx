interface CallOptionProps {
  readonly locale: 'en' | 'es';
  /** hero: compact card under the homepage CTAs; banner: full-width card on the assessment page. */
  readonly variant: 'hero' | 'banner';
}

const copy = {
  en: {
    label: 'OR JUST CALL',
    heroText: 'Take the free check by voice — our agent asks, you talk. About 10 minutes.',
    bannerTitle: 'Prefer talking over typing?',
    bannerText:
      'Call and take the same 11-question check by voice — our agent asks, you just talk about your business. About 10 minutes, score by email.',
    action: 'Call now',
  },
  es: {
    label: 'O SIMPLEMENTE LLAME',
    heroText:
      'Haga el chequeo gratuito por voz — nuestro agente pregunta, usted habla. Unos 10 minutos.',
    bannerTitle: '¿Prefiere hablar en vez de escribir?',
    bannerText:
      'Llame y haga el mismo chequeo de 11 preguntas por voz — nuestro agente pregunta, usted solo habla de su negocio. Unos 10 minutos, puntuación por correo.',
    action: 'Llamar ahora',
  },
} as const;

function formatPhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/gu, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw;
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" width="22" height="22">
      <path
        d="M5.5 4h3l1.7 4.1-2 1.6a12.5 12.5 0 0 0 5.6 5.6l1.6-2 4.1 1.7v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/**
 * The call-in alternative for the free check. Renders nothing until the
 * free-check agent's number is provisioned (NEXT_PUBLIC_FREE_CHECK_PHONE).
 */
export default function CallOption({ locale, variant }: CallOptionProps) {
  const phone = process.env.NEXT_PUBLIC_FREE_CHECK_PHONE;
  if (!phone) return null;

  const text = copy[locale];
  const tel = `tel:${phone.replace(/[^+0-9]/gu, '')}`;
  const pretty = formatPhone(phone);

  if (variant === 'hero') {
    return (
      <a className="call-cta call-cta-hero" href={tel}>
        <span className="call-cta-icon">
          <PhoneIcon />
        </span>
        <span className="call-cta-body">
          <span className="mono-label">{text.label}</span>
          <strong>{pretty}</strong>
          <span className="call-cta-text">{text.heroText}</span>
        </span>
      </a>
    );
  }

  return (
    <aside className="call-cta call-cta-banner" aria-label={text.bannerTitle}>
      <span className="call-cta-icon">
        <PhoneIcon />
      </span>
      <div className="call-cta-body">
        <strong>{text.bannerTitle}</strong>
        <span className="call-cta-text">{text.bannerText}</span>
      </div>
      <a className="button button-primary call-cta-action" href={tel}>
        {text.action} · {pretty}
      </a>
    </aside>
  );
}
