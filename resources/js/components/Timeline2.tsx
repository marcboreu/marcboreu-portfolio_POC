import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import './Timeline2.css';

export type Timeline2Item = { id: string; year: string; title: string; description: string; badges?: string[] };
type Props = { items: Timeline2Item[]; title?: string; eyebrow?: string; intro?: string };
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export default function Timeline2({ items, title = 'Timeline', eyebrow, intro }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const id = useId();
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const section = root.current;
    const viewport = stage.current;
    if (!section || !viewport || !items.length) return;
    const media = window.matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let current = 0;
    let target = 0;
    let previous = 0;
    let lastTime = 0;
    const paint = (time: number) => {
      frame = 0;
      const dt = Math.min(64, Math.max(1, time - (lastTime || time - 16)));
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-dt / 90));
      if (Math.abs(target - current) < 0.0001) current = target;
      const position = current * Math.max(0, items.length - 1);
      const speed = Math.min(1, Math.abs(current - previous) / dt * 1200);
      previous = current;
      viewport.style.setProperty('--progress', String(current));
      viewport.style.setProperty('--stretch', String(1 + speed * 0.7));
      viewport.querySelectorAll<HTMLElement>('[data-timeline-card]').forEach((card, index) => {
        const offset = index - position;
        const distance = Math.abs(offset);
        card.style.transform = `translateY(calc(-50% + ${offset * 260}px)) scale(${1 - Math.min(distance, 3) * 0.06})`;
        card.style.opacity = String(Math.max(0, 1 - distance * 0.55));
        card.style.filter = `blur(${Math.min(distance, 3) * 3}px)`;
        card.style.zIndex = String(100 - Math.round(distance * 10));
      });
      setActive(Math.round(position));
      if (current !== target || speed > 0.002) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      if (!media.matches) return;
      const rect = section.getBoundingClientRect();
      target = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
      if (!frame) { lastTime = 0; frame = requestAnimationFrame(paint); }
    };
    const configure = () => {
      setEnhanced(media.matches);
      cancelAnimationFrame(frame);
      frame = 0;
      if (media.matches) measure();
      else viewport.querySelectorAll<HTMLElement>('[data-timeline-card]').forEach(card => card.removeAttribute('style'));
    };
    configure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    media.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      media.removeEventListener('change', configure);
    };
  }, [items.length]);

  if (!items.length) return null;
  return (
    <section ref={root} className={`timeline2${enhanced ? ' timeline2--enhanced' : ''}`} aria-labelledby={id} style={{ '--steps': Math.max(2, items.length) } as CSSProperties}>
      <div className="timeline2__viewport">
        <header className="timeline2__header">
          {eyebrow && <p>{eyebrow}</p>}
          <h2 id={id}>{title}</h2>
          {intro && <p>{intro}</p>}
        </header>
        <div ref={stage} className="timeline2__stage">
          <div className="timeline2__year" aria-hidden="true">{items[active]?.year}</div>
          <div className="timeline2__spine" aria-hidden="true"><span /><i /></div>
          <ol className="timeline2__list">
            {items.map((item, index) => (
              <li key={item.id} data-timeline-card aria-current={enhanced && index === active ? 'step' : undefined}>
                <p className="timeline2__date">{item.year}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {!!item.badges?.length && <ul className="timeline2__badges">{item.badges.map((badge, i) => <li key={`${badge}-${i}`}>{badge}</li>)}</ul>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
