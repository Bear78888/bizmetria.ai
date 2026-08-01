import type { Locale } from './config';

const messages = {
  en: {
    navigation: {
      home: 'Home',
      account: 'Account',
      signIn: 'Sign in',
      language: 'Español',
    },
    hero: {
      eyebrow: 'BizMetria Business Assessment',
      title: 'Find the clearest AI opportunities in your business.',
      description:
        'The platform foundation is live. The bilingual assessment, deterministic score, and paid workflow are being added in the next implementation stages.',
      primaryAction: 'Platform status',
      secondaryAction: 'Sign in',
    },
    status: {
      title: 'Sandbox foundation',
      items: [
        'Strict TypeScript and App Router',
        'Supabase Auth, RLS, private Storage, and migrations',
        'Typed environment validation without secret exposure',
        'Automated quality, integration, and browser-test foundations',
      ],
    },
    footer: 'Sandbox build — no live payments or production customer data.',
  },
  es: {
    navigation: {
      home: 'Inicio',
      account: 'Cuenta',
      signIn: 'Iniciar sesión',
      language: 'English',
    },
    hero: {
      eyebrow: 'Evaluación Empresarial BizMetria',
      title: 'Encuentra las oportunidades de IA más claras para tu negocio.',
      description:
        'La base de la plataforma está activa. La evaluación bilingüe, la puntuación determinista y el flujo de pago se añadirán en las siguientes etapas.',
      primaryAction: 'Estado de la plataforma',
      secondaryAction: 'Iniciar sesión',
    },
    status: {
      title: 'Base del sandbox',
      items: [
        'TypeScript estricto y App Router',
        'Supabase Auth, RLS, Storage privado y migraciones',
        'Validación tipada del entorno sin exponer secretos',
        'Bases automatizadas para calidad, integración y pruebas de navegador',
      ],
    },
    footer: 'Versión sandbox — sin pagos reales ni datos reales de clientes.',
  },
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}
