import Layout from '@/components/Layout';
import { useT } from '@/lib/i18n';

export default function About() {
    const t = useT();
    return (
        <Layout>
            <h1>{t('about.h1')}</h1>
            <p>{t('about.lead')}</p>
        </Layout>
    );
}
