import { useEffect, useRef, useState } from "react";
import "./DecoderText.css";

export type DecoderTextProps = {
    text: string;
    className?: string;
    delay?: number;
    revealDelay?: number;
    characters?: string;
};

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

export default function DecoderText({
    text,
    className = "",
    delay = 0,
    revealDelay = 34,
    characters = DEFAULT_CHARACTERS,
}: DecoderTextProps) {
    const [output, setOutput] = useState(text);
    const [decoding, setDecoding] = useState(false);
    const runRef = useRef(0);

    useEffect(() => {
        const run = ++runRef.current;
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

        if (reduceMotion) {
            setOutput(text);
            setDecoding(false);
            return;
        }

        let startTimer: number | undefined;
        let frame = 0;
        const startedAt = window.performance.now();

        setDecoding(true);
        setOutput((current) => current.padEnd(text.length, " ").slice(0, text.length));

        const render = () => {
            if (run !== runRef.current) return;
            const elapsed = window.performance.now() - startedAt;
            const progress = Math.max(0, Math.min(1, (elapsed - delay) / Math.max(text.length * revealDelay, 1)));
            const revealed = Math.floor(progress * text.length);
            let next = "";

            for (let index = 0; index < text.length; index += 1) {
                if (index < revealed) {
                    next += text[index];
                } else if (text[index] === " ") {
                    next += " ";
                } else {
                    next += characters[Math.floor(Math.random() * characters.length)] ?? "";
                }
            }

            setOutput(next);

            if (progress < 1) {
                frame = window.requestAnimationFrame(render);
            } else {
                setOutput(text);
                setDecoding(false);
            }
        };

        startTimer = window.setTimeout(() => {
            frame = window.requestAnimationFrame(render);
        }, 0);

        return () => {
            if (startTimer !== undefined) window.clearTimeout(startTimer);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [text, delay, revealDelay, characters]);

    return (
        <span className={`decoder-text${decoding ? " decoder-text--decoding" : ""} ${className}`.trim()} aria-label={text}>
            <span aria-hidden="true">{output}</span>
        </span>
    );
}
