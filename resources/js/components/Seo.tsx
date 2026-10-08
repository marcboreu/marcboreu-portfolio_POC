import { Head, usePage } from "@inertiajs/react";
import { SharedProps, useT } from "@/lib/i18n";

export default function Seo() {
    const { page, canonical, alternates, locale, ogLocale, locales } =
        usePage<SharedProps>().props;
    const t = useT();
    const title = t(`${page}.title`);
    const description = t(`${page}.description`);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Marc Boreu",
        jobTitle: "Software developer",
        url: alternates[locale],
        address: {
            "@type": "PostalAddress",
            addressLocality: "Barcelona",
            addressCountry: "ES",
        },
    };

    return (
        <Head>
            <title>{title}</title>
            <meta
                head-key="description"
                name="description"
                content={description}
            />
            <link head-key="canonical" rel="canonical" href={canonical} />
            {locales.map((l) => (
                <link
                    key={l}
                    head-key={`alt-${l}`}
                    rel="alternate"
                    hrefLang={l}
                    href={alternates[l]}
                />
            ))}
            <link
                head-key="alt-x"
                rel="alternate"
                hrefLang="x-default"
                href={alternates["es"]}
            />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={t("brand")}
            />
            <meta head-key="og:title" property="og:title" content={title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={description}
            />
            <meta head-key="og:url" property="og:url" content={canonical} />
            <meta head-key="og:type" property="og:type" content="website" />
            <meta
                head-key="og:locale"
                property="og:locale"
                content={ogLocale}
            />
            <meta head-key="tw" name="twitter:card" content="summary" />
            <script head-key="ld" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
        </Head>
    );
}
