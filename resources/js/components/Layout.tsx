import type { ReactNode } from "react";
import SoundBar from "@/components/SoundBar";
import { Link } from "@inertiajs/react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="site-header">
                <nav className="site-nav">
                    <Link href="/">Home</Link>
                    <Link href="/projects">Projects</Link>
                    <SoundBar label="Background music" />
                    <LanguageSwitcher />
                </nav>
            </header>
            {children}
        </>
    );
}
