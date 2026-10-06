import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Seo from '@/components/Seo';
import Container from '@/components/ui/Container';
import { SharedProps, useT } from '@/lib/i18n';

const KEYS = ['home', 'about', 'projects', 'contact'];

export default function Layout({ children }: PropsWithChildren) {
    const { urls, locale, locales, alternates, page } = usePage<SharedProps>().props;
    const t = useT();

    return (
        <>
            <Seo />
            <header className="site-header">
                <Container className="site-header__inner">
                    <Link href={urls.home} className="brand">
                        {t('brand')}
                    </Link>
                    <nav className="nav" aria-label="main">
                        {KEYS.map((k) => (
                            <Link
                                key={k}
                                href={urls[k]}
                                className="nav__link"
                                aria-current={page === k ? 'page' : undefined}
                                prefetch
                            >
                                {t(`nav.${k}`)}
                            </Link>
                        ))}
                    </nav>
                    <nav className="lang" aria-label="language">
                        {locales.map((l) => (
                            <Link
                                key={l}
                                href={alternates[l]}
                                hrefLang={l}
                                lang={l}
                                className="lang__link"
                                aria-current={l === locale ? 'true' : undefined}
                            >
                                {l.toUpperCase()}
                            </Link>
                        ))}
                    </nav>
                </Container>
            </header>
            <main id="main">{children}</main>
            <footer className="site-footer">
                <Container>
                    © {new Date().getFullYear()} {t('brand')}
                </Container>
            </footer>
        </>
    );
}
