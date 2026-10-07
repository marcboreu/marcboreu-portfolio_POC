import type { HTMLAttributes } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    children: string;
};

export default function Badge({ children, className = '', ...props }: BadgeProps) {
    return (
        <span className={`badge ${className}`.trim()} {...props}>
            {children}
        </span>
    );
}
