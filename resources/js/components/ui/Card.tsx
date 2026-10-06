import { PropsWithChildren } from 'react';
import { cx } from '@/lib/cx';

export default function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <article className={cx('card', 'stack', className)}>{children}</article>;
}
