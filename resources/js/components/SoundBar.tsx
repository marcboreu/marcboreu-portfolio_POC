import { useEffect, useRef, useState } from 'react';
import './SoundBar.css';

type SoundBarProps = { color?: string; size?: number; label?: string };
const STORAGE_KEY = 'portfolio-soundbar-playing';

function SoundIcon({ playing, size }: { playing: boolean; size: number }) { return <svg aria-hidden="true" className={`soundbar__icon${playing ? ' soundbar__icon--playing' : ''}`} width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M4 10v4h3l4 3V7l-4 3H4Z" fill="currentColor"/><path d={playing ? 'M15 9c1.2 1.2 1.2 4.8 0 6M18 6c2.8 2.8 2.8 9.2 0 12' : 'M16 9.5 20.5 14M20.5 9.5 16 14'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }

export default function SoundBar({ color, size = 25, label = 'Background music' }: SoundBarProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const sync = () => setPlaying(!audio.paused);
        const onError = () => setError(true);
        audio.addEventListener('play', sync);
        audio.addEventListener('pause', sync);
        audio.addEventListener('ended', sync);
        audio.addEventListener('error', onError);
        return () => { audio.removeEventListener('play', sync); audio.removeEventListener('pause', sync); audio.removeEventListener('ended', sync); audio.removeEventListener('error', onError); };
    }, []);

    const handlePlay = async () => {
        const audio = audioRef.current;
        if (!audio || error) return;
        setError(false);
        if (audio.paused) {
            try { await audio.play(); sessionStorage.setItem(STORAGE_KEY, 'true'); }
            catch { setPlaying(false); }
        } else {
            audio.pause();
            sessionStorage.setItem(STORAGE_KEY, 'false');
        }
    };

    return <button type="button" className="soundbar" style={color ? { '--soundbar-color': color } as React.CSSProperties : undefined} onClick={handlePlay} aria-pressed={playing} aria-label={error ? `${label}: audio unavailable` : `${playing ? 'Pause' : 'Play'} ${label}`} title={error ? 'Audio unavailable' : label}><SoundIcon playing={playing} size={size} /><audio ref={audioRef} src="/media/audio/music.mp3" preload="metadata" loop /></button>;
}
