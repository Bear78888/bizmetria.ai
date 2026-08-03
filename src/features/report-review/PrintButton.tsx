'use client';

interface PrintButtonProps {
  readonly locale: 'en' | 'es';
}

/**
 * The professional PDF the offer promises: the report page carries a print
 * stylesheet that strips chrome and lays the report out as a document, and
 * this button opens the browser's save-as-PDF dialog.
 */
export default function PrintButton({ locale }: PrintButtonProps) {
  return (
    <button
      className="button button-secondary print-hidden"
      type="button"
      onClick={() => {
        window.print();
      }}
    >
      {locale === 'es' ? 'Descargar PDF' : 'Download PDF'}
    </button>
  );
}
