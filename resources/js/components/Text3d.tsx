import { useEffect, useRef } from "react";
import "./Text3d.css";

export type Text3dProps = {
    text: string;
    className?: string;
    depth?: number;
    maxTilt?: number;
};

export default function Text3d({
    text,
    className = "",
    depth = 10,
    maxTilt = 8,
}: Text3dProps) {
    const rootRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || typeof window === "undefined") return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce").matches;
        if (reduceMotion) return;

        const handlePointerMove = (event: PointerEvent) => {
            const rect = root.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            root.style.setProperty("--text3d-rotate-x", `${-y * maxTilt}deg`);
            root.style.setProperty("--text3d-rotate-y", `${x * maxTilt}deg`);
        };

        const reset = () => {
            root.style.setProperty("--text3d-rotate-x", "0deg");
            root.style.setProperty("--text3d-rotate-y", "0deg");
        };

        root.addEventListener("pointermove", handlePointerMove);
        root.addEventListener("pointerleave", reset);

        return () => {
            root.removeEventListener("pointermove", handlePointerMove);
            root.removeEventListener("pointerleave", reset);
        };
    }, [maxTilt]);

    return (
        <span
            ref={rootRef}
            className={`text3d ${className}`.trim()}
            style={{ "--text3d-depth": `${depth}px` } as React.CSSProperties}
        >
            <span className="text3d__face">{text}</span>
            <span className="text3d__shadow" aria-hidden="true">{text}</span>
        </span>
    );
}
