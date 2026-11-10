import { Head } from "@inertiajs/react";

export interface BreadcrumbItem {
    name: string;
    url: string;
}

interface SchemaPageProps {
    page: "home" | "about" | "projects" | "contact";
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
    image?: string;
}

export default function SchemaPage({
    page,
    breadcrumbs = [],
    title = "",
    description = "",
    image = "",
}: SchemaPageProps) {
    const baseUrl = process.env.VITE_APP_URL || "https://marcboreu.com";
    
    // BreadcrumbList Schema
    const breadcrumbSchema =
        breadcrumbs.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  "itemListElement": breadcrumbs.map((item, index) => ({
                      "@type": "ListItem",
                      "position": index + 1,
                      "name": item.name,
                      "item": item.url,
                  })),
              }
            : null;

    // WebPage Schema
    const webpageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": `${baseUrl}${breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].url : "/"}`,
        "image": image || `${baseUrl}/images/og-image.png`,
        "isPartOf": {
            "@type": "WebSite",
            "url": baseUrl,
            "name": "Marc Boreu",
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "author": {
            "@type": "Person",
            "name": "Marc Boreu",
            "url": baseUrl,
        },
    };

    return (
        <Head>
            {breadcrumbSchema && (
                <script
                    head-key={`ld-breadcrumb-${page}`}
                    type="application/ld+json"
                >
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
            <script
                head-key={`ld-webpage-${page}`}
                type="application/ld+json"
            >
                {JSON.stringify(webpageSchema)}
            </script>
        </Head>
    );
}
