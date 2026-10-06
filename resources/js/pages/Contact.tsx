import Layout from '@/components/Layout';
import Section from '@/components/ui/Section';
import { useT } from '@/lib/i18n';

export default function Contact() {
    const t = useT();
    return (
        <Layout>
            <Section>
                <h1>{t('contact.h1')}</h1>
                <p className="lead">{t('contact.lead')}</p>
            </Section>
        </Layout>
    );
}
