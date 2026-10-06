import { PropsWithChildren } from 'react';
import { cx } from '@/lib/cx';

export default function Container({ children, className }: PropsWithChildren<{ className?: string }>) {
    return <div className={cx('container', className)}>{children}</div>;
}
