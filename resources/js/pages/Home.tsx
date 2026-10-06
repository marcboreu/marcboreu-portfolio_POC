import Layout from '@/components/Layout';
import { useT } from '@/lib/i18n';

export default function Home() {
    const t = useT();
    return (
        <Layout>
            <h1>{t('home.h1')}</h1>
            <p>{t('home.lead')}</p>
        </Layout>
    );
}
