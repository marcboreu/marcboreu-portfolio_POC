import Section from "@/components/ui/Section";
import { useT } from "@/lib/i18n";

export default function About() {
    const t = useT();
    return (
        <Section>
            <h1>{t("about.h1")}</h1>
            <p className="lead">{t("about.lead")}</p>
        </Section>
    );
}
