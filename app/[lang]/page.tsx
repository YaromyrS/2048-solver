import { notFound } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SolverApp } from '@/components/SolverApp';
import { isLocale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <SolverApp
      languageSwitcher={
        <LanguageSwitcher current={lang} label={getMessages(lang).footer.language} />
      }
    />
  );
}
