import { usePage } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import DecoderText from "@/components/DecoderText";
import DisplacementSphere from "@/components/DisplacementSphere/DisplacementSphere";
import Text3d from "@/components/Text3d";
import { SharedProps, useT } from "@/lib/i18n";
import "./Home.css";

export default function Home() {
    const t = useT();
    const { urls } = usePage<SharedProps>().props;

    return (
        <Section hero>
            <div className="home-hero">
                <div className="home-hero__content">
                    <p className="home-hero__eyebrow">Marc Boreu</p>
                    <h1 className="home-hero__title">
                        <DecoderText text={"MARC BOREU"} />
                    </h1>
                    <p className="home-hero__lead">
                        <Text3d text={t("home.lead")} depth={6} maxTilt={4} />
                    </p>
                    <div className="home-hero__actions">
                        <Button href={urls.projects}>{t("nav.projects")}</Button>
                        <Button href={urls.contact} variant="secondary">{t("nav.contact")}</Button>
                    </div>
                </div>
                <div className="home-hero__visual">
                    <DisplacementSphere size={520} />
                </div>
            </div>
        </Section>
    );
}
