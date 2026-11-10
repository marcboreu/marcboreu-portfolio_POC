import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import './Timeline3.css';

export type Timeline3Phase = {
  id: string;
  phase: string;
  title: string;
  description: string;
  side?: 'left' | 'right';
};

export type Timeline3Group = {
  id: string;
  label: string;
  phases: Timeline3Phase[];
};

type Timeline3Props = {
  groups: Timeline3Group[];
  title?: string;
};

export default function Timeline3({
  groups,
  title = 'Sonicboom Process',
}: Timeline3Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
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
      current += (target - current) * 0.18;

      if (Math.abs(target - current) < 0.001) {
        current = target;
      }

      progressElement.style.height = `${current * 100}%`;
      setProgress(current);

      if (current !== target) {
        frame = requestAnimationFrame(paint);
      }
    };

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target =
        scrollable > 0
          ? Math.max(0, Math.min(1, -rect.top / scrollable))
          : 0;

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
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.2,
      },
    );

    const animatedItems = root.querySelectorAll<HTMLElement>('[data-animate]');
    animatedItems.forEach((item) => observer.observe(item));

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
  }, [groups.length]);

  if (!groups.length) {
    return null;
  }

  let phaseIndex = 0;

  return (
    <section
      ref={rootRef}
      className="timeline3"
      aria-labelledby={headingId}
      style={{ '--timeline3-progress': progress } as CSSProperties}
    >
      <div className="timeline3__wrapper">
        <h2 id={headingId}>{title}</h2>

        <div className="timeline3">
          <div className="timeline3__progress" aria-hidden="true">
            <div
              ref={progressRef}
              className="timeline3__progress-fill"
            />
          </div>

          <ul className="timeline3__blocks">
            {groups.map((group) => (
              <li
                key={group.id}
                className="timeline3__block"
              >
                <div
                  className="timeline3__block-label"
                  data-animate="label"
                  aria-hidden="true"
                >
                  <span>{group.label}</span>
                </div>

                {group.phases.map((phase) => {
                  phaseIndex += 1;
                  const side = phase.side ?? (phaseIndex % 2 === 1 ? 'right' : 'left');

                  return (
                    <li
                      key={phase.id}
                      className={`timeline3__item timeline3__item--${side}`}
                      data-animate="item"
                    >
                      <div className="timeline3__content">
                        <h3>{phase.title}</h3>

                        <div className="timeline3__time">
                          {side === 'left' ? (
                            <span className="timeline3__line" aria-hidden="true" />
                          ) : null}

                          <div className="timeline3__circle">
                            <svg
                              viewBox="0 0 100 100"
                              focusable="false"
                              aria-hidden="true"
                            >
                              <circle
                                className="timeline3__circle-path"
                                cx="50"
                                cy="50"
                                r="49"
                                pathLength={100}
                              />
                            </svg>
                            <span className="timeline3__phase-text">
                              {phase.phase}
                            </span>
                          </div>

                          {side === 'right' ? (
                            <span className="timeline3__line" aria-hidden="true" />
                          ) : null}
                        </div>

                        <p>{phase.description}</p>
                      </div>
                    </li>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
