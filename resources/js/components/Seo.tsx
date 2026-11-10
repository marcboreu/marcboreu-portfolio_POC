import { Head, usePage } from "@inertiajs/react";
import { SharedProps, useT } from "@/lib/i18n";

export default function Seo() {
    const { page, canonical, alternates, locale, ogLocale, locales } =
        usePage<SharedProps>().props;
    const t = useT();
    const title = t(`${page}.title`);
    const description = t(`${page}.description`);
    
    // Base URLs (in production, these should come from config via Inertia)
    const baseUrl = process.env.VITE_APP_URL || "https://marcboreu.com";
    const ogImage = `${baseUrl}/images/og-image.png`;
    const ogImageWidth = 1200;
    const ogImageHeight = 630;
    
    // Global Schemas
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Marc Boreu",
        "url": baseUrl,
        "logo": `${baseUrl}/images/logo.png`,
        "description": "Full-stack developer and creative technologist",
        "email": "contact@marcboreu.com",
        "sameAs": [
            "https://linkedin.com/in/marcboreu",
            "https://github.com/marcboreu",
            "https://twitter.com/marcboreu",
        ],
    };

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Marc Boreu",
        "title": "Full-stack Developer",
        "image": `${baseUrl}/images/profile.jpg`,
        "description": "Creative technologist passionate about building beautiful, performant web experiences",
        "email": "contact@marcboreu.com",
        "url": baseUrl,
        "jobTitle": "Full-stack Developer",
        "sameAs": [
            "https://linkedin.com/in/marcboreu",
            "https://github.com/marcboreu",
            "https://twitter.com/marcboreu",
        ],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Barcelona",
            "addressCountry": "ES",
        },
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": baseUrl,
        "name": "Marc Boreu",
        "description": "Full-stack developer and creative technologist",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta
                head-key="description"
                name="description"
                content={description}
            />
            
            {/* Canonical & Language Links */}
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
            
            {/* Open Graph Meta Tags */}
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
            
            {/* Open Graph Image */}
            <meta
                head-key="og:image"
                property="og:image"
                content={ogImage}
            />
            <meta
                head-key="og:image:width"
                property="og:image:width"
                content={ogImageWidth.toString()}
            />
            <meta
                head-key="og:image:height"
                property="og:image:height"
                content={ogImageHeight.toString()}
            />
            
            {/* Twitter Card Meta Tags */}
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            <meta
                head-key="twitter:creator"
                name="twitter:creator"
                content="@marcboreu"
            />
            <meta
                head-key="twitter:site"
                name="twitter:site"
                content="@marcboreu"
            />
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={title}
            />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={description}
            />
            <meta
                head-key="twitter:image"
                name="twitter:image"
                content={ogImage}
            />
            
            {/* Apple Meta Tags */}
            <meta
                head-key="apple-mobile-web-app-capable"
                name="apple-mobile-web-app-capable"
                content="yes"
            />
            <meta
                head-key="apple-mobile-web-app-status-bar-style"
                name="apple-mobile-web-app-status-bar-style"
                content="black-translucent"
            />
            <meta
                head-key="apple-mobile-web-app-title"
                name="apple-mobile-web-app-title"
                content="Marc Boreu"
            />
            
            {/* Technical SEO Meta Tags */}
            <meta
                head-key="viewport"
                name="viewport"
                content="width=device-width, initial-scale=1, viewport-fit=cover"
            />
            <meta
                head-key="theme-color"
                name="theme-color"
                content="#000000"
            />
            <meta
                head-key="color-scheme"
                name="color-scheme"
                content="dark light"
            />
            <meta
                head-key="robots"
                name="robots"
                content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
            />
            <meta
                head-key="referrer"
                name="referrer"
                content="strict-origin-when-cross-origin"
            />
            
            {/* Resource Hints */}
            <link
                head-key="dns-prefetch-google-fonts"
                rel="dns-prefetch"
                href="//fonts.googleapis.com"
            />
            <link
                head-key="preconnect-google-fonts-gstatic"
                rel="preconnect"
                href="//fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                head-key="prefetch-next-page"
                rel="prefetch"
                as="fetch"
                crossOrigin="anonymous"
            />
            
            {/* Favicon and Branding */}
            <link
                head-key="icon-favicon"
                rel="icon"
                type="image/x-icon"
                href="/favicon.ico"
            />
            <link
                head-key="icon-favicon-16"
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
            />
            <link
                head-key="icon-favicon-32"
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
            />
            <link
                head-key="icon-apple-touch"
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
            />
            <link
                head-key="icon-android-192"
                rel="icon"
                type="image/png"
                sizes="192x192"
                href="/android-chrome-192x192.png"
            />
            <link
                head-key="icon-android-512"
                rel="icon"
                type="image/png"
                sizes="512x512"
                href="/android-chrome-512x512.png"
            />
            <link
                head-key="manifest"
                rel="manifest"
                href="/site.webmanifest"
            />
            
            {/* JSON-LD Structured Data */}
            <script
                head-key="ld-organization"
                type="application/ld+json"
            >
                {JSON.stringify(organizationSchema)}
            </script>
            <script
                head-key="ld-person"
                type="application/ld+json"
            >
                {JSON.stringify(personSchema)}
            </script>
            <script
                head-key="ld-website"
                type="application/ld+json"
            >
                {JSON.stringify(websiteSchema)}
            </script>
        </Head>
    );
}
