import { PropsWithChildren } from 'react';
import Container from '@/components/ui/Container';
import { cx } from '@/lib/cx';

type Props = PropsWithChildren<{ hero?: boolean; id?: string; className?: string }>;

export default function Section({ children, hero, id, className }: Props) {
    return (
        <section id={id} className={cx('section', hero && 'section--hero', className)}>
            <Container className="stack">{children}</Container>
        </section>
    );
}
