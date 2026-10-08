import { Link } from '@inertiajs/react';
import { useLocale } from '@/lib/i18n';
import './LanguageSwitcher.css';

const locales = [
    { code: 'ca', label: 'CA' },
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
] as const;

export default function LanguageSwitcher() {
    const locale = useLocale();
    return <nav className="language-switcher" aria-label="Language"><span className="language-switcher__label">{locale.toUpperCase()}</span>{locales.map((item) => <Link key={item.code} href={`/${item.code}`} className={locale === item.code ? 'is-active' : ''} aria-current={locale === item.code ? 'page' : undefined}>{item.label}</Link>)}</nav>;
}
