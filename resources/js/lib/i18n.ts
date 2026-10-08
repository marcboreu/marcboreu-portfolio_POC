import { usePage } from "@inertiajs/react";

export type SharedProps = {
    locale: string;
    locales: string[];
    messages: Record<string, any>;
    urls: Record<string, string>;
    page: string;
    alternates: Record<string, string>;
    canonical: string;
    ogLocale: string;
};

export function useT() {
    const { messages } = usePage<SharedProps>().props;
    return (key: string): string =>
        key.split(".").reduce<any>((o, k) => o?.[k], messages) ?? key;
}
