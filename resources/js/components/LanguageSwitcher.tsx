import { Link, usePage } from "@inertiajs/react";
import "./LanguageSwitcher.css";

import type { SharedProps } from "@/lib/i18n";

type Locale = "es" | "ca" | "en";

type LanguageProps = Pick<SharedProps, "locale" | "locales" | "alternates">;

export default function LanguageSwitcher() {
    const { locale, locales, alternates } = usePage<LanguageProps>().props;

    return (
        <nav className="language-switcher" aria-label="Language">
            <span className="language-switcher__label">
                {locale.toUpperCase()}
            </span>
            {locales.map((item: Locale) => (
                <Link
                    key={item}
                    href={alternates[item]}
                    className={locale === item ? "is-active" : ""}
                    aria-current={locale === item ? "page" : undefined}
                >
                    {item.toUpperCase()}
                </Link>
            ))}
        </nav>
    );
}
