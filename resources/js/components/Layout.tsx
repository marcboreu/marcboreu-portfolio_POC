import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Seo from '@/components/Seo';
import { SharedProps, useT } from '@/lib/i18n';

const KEYS = ['home', 'about', 'projects', 'contact'];

export default function Layout({ children }: PropsWithChildren) {
    const { urls, locale, locales, alternates, page } = usePage<SharedProps>().props;
    const t = useT();

    return (
        <>
            <Seo />
            <header>
                <nav aria-label="main">
                    {KEYS.map((k) => (
                        <Link key={k} href={urls[k]} aria-current={page === k ? 'page' : undefined} prefetch>
                            {t(`nav.${k}`)}
                        </Link>
                    ))}
                </nav>
                <nav aria-label="language">
                    {locales.map((l) => (
                        <Link key={l} href={alternates[l]} hrefLang={l} aria-current={l === locale ? 'true' : undefined}>
                            {l.toUpperCase()}
                        </Link>
                    ))}
                </nav>
            </header>
            <main>{children}</main>
        </>
    );
}
