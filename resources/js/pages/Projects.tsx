import Layout from '@/components/Layout';
import Section from '@/components/ui/Section';
import { useT } from '@/lib/i18n';

export default function Projects() {
    const t = useT();
    return (
        <Layout>
            <Section>
                <h1>{t('projects.h1')}</h1>
                <p className="lead">{t('projects.lead')}</p>
            </Section>
        </Layout>
    );
}
