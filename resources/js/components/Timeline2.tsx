import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import './Timeline2.css';

export type Timeline2Item = {
  id: string;
  year: string;
  title: string;
  description: string;
};

type Timeline2Props = {
  items: Timeline2Item[];
  eyebrow?: string;
  title?: string;
  intro?: string;
  scrub?: number;
  step?: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const powerInOut = (value: number) => (value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2);

export default function Timeline2({
  items,
  eyebrow = 'Chronicle',
  title = 'Selected work',
  intro,
  scrub = 0.6,
  step = 0.85,
}: Timeline2Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const spineFillRef = useRef<HTMLSpanElement | null>(null);
  const spineHeadRef = useRef<HTMLSpanElement | null>(null);
  const rayRef = useRef<HTMLSpanElement | null>(null);
  const headingId = useId();
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  const years = useMemo(() => items.map((item) => item.year), [items]);
  const itemCount = Math.max(items.length, 1);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const spineFill = spineFillRef.current;
    const spineHead = spineHeadRef.current;
    const ray = rayRef.current;

    if (!root || !stage || !spineFill || !spineHead || !ray || !items.length) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let current = 0;
    let target = 0;
    let previous = 0;
    let lastTime = 0;
    let velocity = 0;

    const paint = (time: number) => {
      frame = 0;
      const deltaTime = Math.min(64, Math.max(1, time - (lastTime || time - 16)));
      lastTime = time;

      const smoothing = 1 - Math.exp(-deltaTime / (scrub * 1000));
      current += (target - current) * smoothing;

      if (Math.abs(target - current) < 0.0001) {
        current = target;
      }

      const instantVelocity = (current - previous) / (deltaTime / 1000);
      previous = current;
      velocity += (instantVelocity - velocity) * 0.16;

      const eased = powerInOut(current);
      const stretched = 1 + clamp(Math.abs(velocity) * 0.35) * 0.55;
      const handoff = 1 - Math.abs((current * (itemCount - 1)) % 1 - 0.5) * 2;

      stage.style.setProperty('--timeline2-index', String(eased * (itemCount - 1)));
      stage.style.setProperty('--timeline2-velocity', String(clamp(Math.abs(velocity) * 0.35)));
      stage.style.setProperty('--timeline2-handoff', String(handoff));

      spineFill.style.transform = `scaleY(${eased})`;
      spineHead.style.top = `${eased * 100}%`;
      spineHead.style.transform = `translate(-50%, -50%) scaleY(${stretched})`;
      ray.style.opacity = String(clamp(handoff * 1.4 - 0.2));
      ray.style.transform = `scaleX(${0.35 + handoff * 0.65})`;

      setProgress(current);
      setActiveIndex(Math.round(current * (itemCount - 1)));

      if (current !== target || Math.abs(velocity) > 0.001) {
        frame = requestAnimationFrame(paint);
      }
    };

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const scrollable = root.offsetHeight - window.innerHeight;
      target = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;

      if (!frame && !reducedMotion.matches) {
        lastTime = 0;
        frame = requestAnimationFrame(paint);
      }
    };

    const configure = () => {
      setEnhanced(!reducedMotion.matches);

      if (reducedMotion.matches) {
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }

        spineFill.style.transform = 'scaleY(1)';
        spineHead.style.transform = 'translate(-50%, -50%)';
        ray.style.opacity = '0';
        stage.style.setProperty('--timeline2-index', '0');
        stage.style.setProperty('--timeline2-velocity', '0');
        stage.style.setProperty('--timeline2-handoff', '0');
        setProgress(0);
        setActiveIndex(0);
        return;
      }

      measure();
    };

    configure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    reducedMotion.addEventListener('change', configure);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      reducedMotion.removeEventListener('change', configure);
    };
  }, [items.length, scrub]);

  const seek = (index: number) => {
    const root = rootRef.current;

    if (!root) return;

    const scrollable = root.offsetHeight - window.innerHeight;
    const targetProgress = itemCount > 1 ? index / (itemCount - 1) : 0;
    window.scrollTo({
      top: root.offsetTop + targetProgress * scrollable,
      behavior: 'smooth',
    });
  };

  const onIndexKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      seek(index);
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className={`timeline2${enhanced ? ' timeline2--live' : ''}`}
      aria-labelledby={headingId}
      style={{
        '--timeline2-steps': itemCount,
        '--timeline2-step': step,
      } as CSSProperties}
    >
      <div className="timeline2__sticky">
        <div className="timeline2__frame">
          <header className="timeline2__header">
            <p className="timeline2__eyebrow">{eyebrow}</p>
            <h2 id={headingId}>{title}</h2>
            {intro ? <p className="timeline2__intro">{intro}</p> : null}
          </header>

          <nav className="timeline2__index" aria-label="Timeline years">
            {years.map((year, index) => (
              <button
                key={`${year}-${index}`}
                type="button"
                className={`timeline2__index-button${index === activeIndex ? ' timeline2__index-button--active' : ''}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => seek(index)}
                onKeyDown={(event) => onIndexKeyDown(event, index)}
              >
                {year}
              </button>
            ))}
          </nav>

          <div
            ref={stageRef}
            className="timeline2__stage"
            style={{
              '--timeline2-index': 0,
              '--timeline2-velocity': 0,
              '--timeline2-handoff': 0,
            } as CSSProperties}
          >
            <div className="timeline2__spine" aria-hidden="true">
              <span ref={spineFillRef} className="timeline2__spine-fill" />
              <span ref={spineHeadRef} className="timeline2__spine-head" />
              <span ref={rayRef} className="timeline2__ray" />

              {items.map((item, index) => (
                <button
                  key={`tick-${item.id}`}
                  type="button"
                  className={`timeline2__tick${index <= activeIndex ? ' timeline2__tick--passed' : ''}`}
                  style={{ top: `${(index / Math.max(1, itemCount - 1)) * 100}%` }}
                  aria-label={`Go to ${item.year}: ${item.title}`}
                  onClick={() => seek(index)}
                />
              ))}
            </div>

            <div className="timeline2__year" aria-hidden="true">
              {items[activeIndex]?.year ?? ''}
            </div>

            <ol className="timeline2__entries">
              {items.map((item, index) => {
                const offset = index - progress * (itemCount - 1);
                const distance = Math.abs(offset);
                const depth = clamp(distance / 2.4);

                return (
                  <li
                    key={item.id}
                    className={`timeline2__entry${index === activeIndex ? ' timeline2__entry--active' : ''}`}
                    style={{
                      '--entry-offset': offset,
                      '--entry-depth': depth,
                    } as CSSProperties}
                    aria-current={index === activeIndex ? 'step' : undefined}
                  >
                    <article className="timeline2__card">
                      <p className="timeline2__card-year">{item.year}</p>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
