import { useEffect, useRef, useState } from "react";
import "./DecoderText.css";

export type DecoderTextProps = {
    text: string;
    className?: string;
    initialPause?: number;
    revealDelay?: number;
    binaryChangeDelay?: number;
};

const BINARY_CHARACTERS = "01";

function randomBinary(): string {
    return BINARY_CHARACTERS[
        Math.floor(Math.random() * BINARY_CHARACTERS.length)
    ];
}

function createBinaryOutput(text: string): string {
    return Array.from(text, (character) =>
        character === " " ? " " : randomBinary(),
    ).join("");
}

export default function DecoderText({
    text,
    className = "",
    initialPause = 1000,
    revealDelay = 300,
    binaryChangeDelay = 100,
}: DecoderTextProps) {
    const [output, setOutput] = useState(() => createBinaryOutput(text));
    const [decoding, setDecoding] = useState(false);
    const runRef = useRef(0);

    useEffect(() => {
        const run = ++runRef.current;
        const reducedMotion =
            window.matchMedia?.(
                "(prefers-reduced-motion: reduce)",
            ).matches ?? false;

        if (reducedMotion) {
            setOutput(text);
            setDecoding(false);
            return;
        }

        let frame = 0;
        let startTimer: number | undefined;
        let startedAt = 0;
        let lastBinaryChange = 0;
        let binaryOutput = createBinaryOutput(text);

        setOutput(binaryOutput);
        setDecoding(false);

        startTimer = window.setTimeout(() => {
            if (run !== runRef.current) {
                return;
            }

            setDecoding(true);
            startedAt = window.performance.now();
            lastBinaryChange = startedAt;

            const render = (time: number) => {
                if (run !== runRef.current) {
                    return;
                }

                const elapsed = time - startedAt;
                const revealedCount = Math.min(
                    text.length,
                    Math.floor(elapsed / Math.max(revealDelay, 1)),
                );

                if (time - lastBinaryChange >= binaryChangeDelay) {
                    binaryOutput = createBinaryOutput(text);
                    lastBinaryChange = time;
                }

                let nextOutput = "";

                for (let index = 0; index < text.length; index += 1) {
                    if (index < revealedCount) {
                        nextOutput += text[index];
                    } else {
                        nextOutput += binaryOutput[index] ?? " ";
                    }
                }

                setOutput(nextOutput);

                if (revealedCount < text.length) {
                    frame = window.requestAnimationFrame(render);
                    return;
                }

                setOutput(text);
                setDecoding(false);
            };

            frame = window.requestAnimationFrame(render);
        }, initialPause);

        return () => {
            if (startTimer !== undefined) {
                window.clearTimeout(startTimer);
            }

            if (frame !== 0) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, [text, initialPause, revealDelay, binaryChangeDelay]);

    return (
        <span
            className={`decoder-text${
                decoding ? " decoder-text--decoding" : ""
            } ${className}`.trim()}
            aria-label={text}
        >
            <span aria-hidden="true">{output}</span>
        </span>
    );
}