import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import '../globals.css';

const locales = ['en', 'zh'] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!hasLocale(locales, locale)) {
    notFound();
  }

  // Enable static rendering and tell getRequestConfig the locale
  setRequestLocale(locale);

  // Load messages directly and pass to provider
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className="dark">
      <body className="bg-[#050505] text-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
