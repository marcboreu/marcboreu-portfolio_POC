import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import SoundBar from "@/components/SoundBar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Container from "@/components/ui/Container";
import { SharedProps, useT } from "@/lib/i18n";

const KEYS = ["home", "about", "projects", "contact"] as const;

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
    const { urls, page } = usePage<SharedProps>().props;
    const t = useT();

    return (
        <>
            <a className="skip-link" href="#main">
                {t("skip")}
            </a>
            <header className="site-header">
                <Container>
                    <SoundBar label="Background music" />
                    <a className="brand" href={urls.home}>
                        {t("brand")}
                    </a>
                    <nav className="nav" aria-label="main">
                        {KEYS.map((key) => (
                            <Link
                                key={key}
                                href={urls[key]}
                                className="nav__link"
                                aria-current={page === key ? "page" : undefined}
                                prefetch
                            >
                                {t(`nav.${key}`)}
                            </Link>
                        ))}
                    </nav>
                    <LanguageSwitcher />
                </Container>
            </header>
            <main id="main">{children}</main>
            <footer className="site-footer">
                <Container>
                    © {new Date().getFullYear()} {t("brand")}
                </Container>
            </footer>
        </>
    );
}
