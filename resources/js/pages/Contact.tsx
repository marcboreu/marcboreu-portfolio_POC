import Layout from '@/components/Layout';
import { useT } from '@/lib/i18n';

export default function Contact() {
    const t = useT();
    return (
        <Layout>
            <h1>{t('contact.h1')}</h1>
            <p>{t('contact.lead')}</p>
        </Layout>
    );
}
