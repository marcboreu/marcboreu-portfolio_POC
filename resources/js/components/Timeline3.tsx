import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import './Timeline3.css';

export type Timeline3Item = {
  id: string;
  date: string;
  title: string;
  description: string;
  label?: string;
  badges?: string[];
};

type Timeline3Props = {
  items: Timeline3Item[];
  title?: string;
  eyebrow?: string;
  intro?: string;
};

export default function Timeline3({
  items,
  title = 'Timeline',
  eyebrow,
  intro,
}: Timeline3Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const headingId = useId();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const progressElement = progressRef.current;

    if (!root || !progressElement) {
      return undefined;
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    let frame = 0;
    let current = 0;
    let target = 0;

    const paint = () => {
      frame = 0;
      current += (target - current) * 0.16;

      if (Math.abs(target - current) < 0.001) {
        current = target;
      }

      progressElement.style.transform = `scaleY(${current})`;
      setProgress(current);

      if (current !== target) {
        frame = requestAnimationFrame(paint);
      }
    };

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;

      if (!frame && !reducedMotion.matches) {
        frame = requestAnimationFrame(paint);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.toggleAttribute('data-visible', entry.isIntersecting);
        });
      },
      {
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.15,
      },
    );

    const animatedElements = root.querySelectorAll<HTMLElement>(
      '[data-animate]',
    );
    animatedElements.forEach((element) => observer.observe(element));

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      observer.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [items.length]);

  if (!items.length) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className="timeline3"
      aria-labelledby={headingId}
      style={{ '--timeline3-progress': progress } as CSSProperties}
    >
      <div className="timeline3__inner">
        <header className="timeline3__header">
          {eyebrow ? <p className="timeline3__eyebrow">{eyebrow}</p> : null}
          <h2 id={headingId}>{title}</h2>
          {intro ? <p className="timeline3__intro">{intro}</p> : null}
        </header>

        <div className="timeline3__wrapper">
          <div className="timeline3__rail" aria-hidden="true">
            <span
              ref={progressRef}
              className="timeline3__progress"
            />
          </div>

          <ol className="timeline3__list">
            {items.map((item, index) => {
              const side = index % 2 === 0 ? 'right' : 'left';

              return (
                <li
                  key={item.id}
                  className={`timeline3__item timeline3__item--${side}`}
                >
                  <div
                    className="timeline3__circle"
                    data-animate="circle"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 48 48" focusable="false">
                      <circle
                        className="timeline3__circle-track"
                        cx="24"
                        cy="24"
                        r="21"
                      />
                      <circle
                        className="timeline3__circle-path"
                        cx="24"
                        cy="24"
                        r="21"
                        pathLength={100}
                      />
                    </svg>
                  </div>

                  <span
                    className="timeline3__connector"
                    data-animate="line"
                    aria-hidden="true"
                  />

                  <article
                    className="timeline3__content"
                    data-animate="content"
                  >
                    {item.label ? (
                      <p className="timeline3__label">{item.label}</p>
                    ) : null}
                    <p className="timeline3__date">{item.date}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    {item.badges?.length ? (
                      <ul className="timeline3__badges">
                        {item.badges.map((badge, badgeIndex) => (
                          <li key={`${item.id}-${badge}-${badgeIndex}`}>
                            {badge}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
