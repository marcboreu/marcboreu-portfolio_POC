import { useT } from "@/lib/i18n";
import "./CompanyLogoMarquee.css";

type Company = { name: string; slug: string };

const companies: Company[] = [
    { name: "Barcelona Activa", slug: "barcelona-activa" },
    { name: "Food Souvenir Barcelona", slug: "food-souvenir-barcelona" },
    { name: "Interficie Internet Services", slug: "interficie" },
    { name: "MediaMarkt", slug: "mediamarkt" },
    { name: "El Corte Inglés", slug: "el-corte-ingles" },
    { name: "Fira de Barcelona", slug: "fira-barcelona" },
    { name: "PortAventura", slug: "portaventura" },
    { name: "Havaianas", slug: "havaianas" },
    { name: "Facilitea", slug: "facilitea" },
    { name: "CaixaBank", slug: "caixabank" },
    { name: "BBVA", slug: "bbva" },
    { name: "LOEWE", slug: "loewe" },
];

const logoModules = import.meta.glob("/public/media/companies/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
}) as Record<string, string>;

function logoUrl(slug: string) {
    return logoModules[`/public/media/companies/${slug}.svg`];
}

function CompanySet() {
    const t = useT();

    return (
        <>
            {companies.map((company) => (
                <div className="company-logo-marquee__item" key={company.slug}>
                    <img
                        className="company-logo-marquee__logo"
                        src={logoUrl(company.slug)}
                        alt={company.name}
                        loading="lazy"
                        title={t(`companies.logos.${company.slug}`)}
                    />
                </div>
            ))}
        </>
    );
}

function Track() {
    return (
        <div className="company-logo-marquee__track">
            <div className="company-logo-marquee__set">
                <CompanySet />
            </div>
            <div className="company-logo-marquee__set" aria-hidden="true">
                <CompanySet />
            </div>
        </div>
    );
}

export default function CompanyLogoMarquee() {
    const t = useT();

    return (
        <section
            className="company-logo-marquee"
            aria-labelledby="company-logo-marquee-title"
        >
            <div className="company-logo-marquee__inner">
                <p className="company-logo-marquee__eyebrow">
                    {t("companies.eyebrow")}
                </p>
                <h2 id="company-logo-marquee-title">
                    {t("companies.title")}
                </h2>
                <div className="company-logo-marquee__viewport">
                    <Track />
                </div>
            </div>
        </section>
    );
}
