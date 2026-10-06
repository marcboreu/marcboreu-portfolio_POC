import Layout from '@/components/Layout';
import { useT } from '@/lib/i18n';

export default function Projects() {
    const t = useT();
    return (
        <Layout>
            <h1>{t('projects.h1')}</h1>
            <p>{t('projects.lead')}</p>
        </Layout>
    );
}
