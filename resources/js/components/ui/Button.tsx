import { Link } from '@inertiajs/react';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cx } from '@/lib/cx';

type Props = PropsWithChildren<
    { variant?: 'primary' | 'secondary'; href?: string } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export default function Button({ variant = 'primary', href, className, children, ...rest }: Props) {
    const classes = cx('btn', `btn--${variant}`, className);

    if (href) {
        return (
            <Link href={href} className={classes} prefetch>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
}
