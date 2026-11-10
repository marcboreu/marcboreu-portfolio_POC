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

/**
 * Animation configuration for Timeline3 component.
 * All properties are optional; undefined values use built-in defaults.
 */
export type Timeline3AnimationConfig = {
  /** Animation duration in milliseconds. Default: 900ms */
  duration?: number;
  /**
   * Easing function as a CSS cubic-bezier string, or an object with
   * per-animation-type overrides. Default: 'cubic-bezier(0.22, 1, 0.36, 1)'
   */
  easing?: string | {
    /** Easing for circle path stroke animation. Default: 'cubic-bezier(0.22, 1, 0.36, 1)' */
    circle?: string;
    /** Easing for connecting lines animation. Default: 'cubic-bezier(0.22, 1, 0.36, 1)' */
    line?: string;
    /** Easing for text content fade animation. Default: 'cubic-bezier(0.22, 1, 0.36, 1)' */
    text?: string;
  };
  /**
   * Animation variant preset. 'smooth' uses slower easing, 'energetic' uses faster easing.
   * Default: 'smooth'
   */
  variant?: 'smooth' | 'energetic';
};

/**
 * Color customization for Timeline3 component.
 * All properties are optional CSS color values (hex, rgb, hsl); undefined values use built-in defaults.
 */
export type Timeline3ColorConfig = {
  /** Color of the progress bar fill. Default: '#fff' */
  progress?: string;
  /** Color of connecting lines. Default: '#fff' */
  line?: string;
  /** Color of circle path stroke. Default: '#fff' */
  circle?: string;
  /** Color of timeline content text. Default: '#fff' */
  text?: string;
};

/**
 * Layout customization for Timeline3 component.
 * All properties are optional CSS length values; undefined values use built-in defaults.
 */
export type Timeline3LayoutConfig = {
  /** Vertical spacing between timeline items. Default: '5rem' */
  itemSpacing?: string;
  /** Width and height of circle indicators. Default: '6.125rem' */
  circleSize?: string;
  /** Padding for timeline item content relative to center line. Default: '7.5rem' */
  contentPadding?: string;
};

/**
 * Radial line configuration for Timeline3 component.
 * Controls the emanating lines that appear when circles are "touched" by the progress bar.
 */
export type Timeline3RadialLineConfig = {
  /** Distance in pixels from circle center to the fixed endpoint. Default: 100 */
  distance?: number;
  /** Width of the radial line stroke in pixels. Default: 2 */
  width?: number;
};

/**
 * Comprehensive configuration object for Timeline3 component customization.
 * All top-level properties are optional; provide only the customizations you need.
 * Undefined properties fall back to built-in defaults.
 */
export type Timeline3Config = {
  /** Animation timing and easing customization */
  animations?: Timeline3AnimationConfig;
  /** Color customization for visual elements */
  colors?: Timeline3ColorConfig;
  /** Layout and spacing customization */
  layout?: Timeline3LayoutConfig;
  /** Radial line customization (lines emanating from circles) */
  radialLine?: Timeline3RadialLineConfig;
};

type Timeline3Props = {
  groups: Timeline3Group[];
  title?: string;
  /** Optional configuration object for customizing animations, colors, and layout */
  config?: Timeline3Config;
};

// Default configuration values
const DEFAULT_ANIMATION_CONFIG: Required<Timeline3AnimationConfig> = {
  duration: 900,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  variant: 'smooth',
};

const EASING_VARIANTS = {
  smooth: {
    circle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    line: 'cubic-bezier(0.33, 0.66, 0.66, 1)',
    text: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  energetic: {
    circle: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    line: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    text: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

const DEFAULT_COLOR_CONFIG: Required<Timeline3ColorConfig> = {
  progress: '#fff',
  line: '#fff',
  circle: '#fff',
  text: '#fff',
};

const DEFAULT_LAYOUT_CONFIG: Required<Timeline3LayoutConfig> = {
  itemSpacing: '5rem',
  circleSize: '6.125rem',
  contentPadding: '7.5rem',
};

const DEFAULT_RADIAL_LINE_CONFIG: Required<Timeline3RadialLineConfig> = {
  distance: 100,
  width: 2,
};

/**
 * Merges user-provided config with built-in defaults.
 * Returns a complete config object with all values defined.
 */
function mergeConfig(userConfig?: Timeline3Config) {
  const animations = userConfig?.animations ?? {};
  const variant = animations.variant ?? DEFAULT_ANIMATION_CONFIG.variant;
  
  // Resolve easing: prefer per-type overrides, fallback to variant, then default
  const baseEasing = typeof animations.easing === 'string' 
    ? animations.easing 
    : EASING_VARIANTS[variant];
  
  const easing = typeof animations.easing === 'object' && animations.easing
    ? {
        circle: animations.easing.circle ?? baseEasing.circle,
        line: animations.easing.line ?? baseEasing.line,
        text: animations.easing.text ?? baseEasing.text,
      }
    : baseEasing;

  return {
    animations: {
      duration: animations.duration ?? DEFAULT_ANIMATION_CONFIG.duration,
      easing,
      variant,
    },
    colors: {
      progress: userConfig?.colors?.progress ?? DEFAULT_COLOR_CONFIG.progress,
      line: userConfig?.colors?.line ?? DEFAULT_COLOR_CONFIG.line,
      circle: userConfig?.colors?.circle ?? DEFAULT_COLOR_CONFIG.circle,
      text: userConfig?.colors?.text ?? DEFAULT_COLOR_CONFIG.text,
    },
    layout: {
      itemSpacing: userConfig?.layout?.itemSpacing ?? DEFAULT_LAYOUT_CONFIG.itemSpacing,
      circleSize: userConfig?.layout?.circleSize ?? DEFAULT_LAYOUT_CONFIG.circleSize,
      contentPadding: userConfig?.layout?.contentPadding ?? DEFAULT_LAYOUT_CONFIG.contentPadding,
    },
    radialLine: {
      distance: userConfig?.radialLine?.distance ?? DEFAULT_RADIAL_LINE_CONFIG.distance,
      width: userConfig?.radialLine?.width ?? DEFAULT_RADIAL_LINE_CONFIG.width,
    },
  };
}

export type MergedTimeline3Config = ReturnType<typeof mergeConfig>;

/**
 * Timeline3 - A scrollable timeline component with customizable animations, colors, and layout.
 *
 * The component tracks scroll position and animates timeline items as they become visible.
 * All aspects can be customized via the optional `config` prop while maintaining backwards compatibility.
 *
 * @component
 *
 * @param {Timeline3Props} props - Component props
 * @param {Timeline3Group[]} props.groups - Timeline data organized by groups and phases
 * @param {string} [props.title='Sonicboom Process'] - Title displayed above the timeline
 * @param {Timeline3Config} [props.config] - Optional configuration for animations, colors, and layout
 *
 * @returns {JSX.Element | null} The rendered timeline component, or null if no groups are provided
 *
 * @example
 * // Basic usage with defaults
 * <Timeline3 groups={myGroups} />
 *
 * @example
 * // Custom animation timing and variant
 * <Timeline3
 *   groups={myGroups}
 *   config={{
 *     animations: {
 *       duration: 1200,      // milliseconds
 *       variant: 'energetic', // 'smooth' | 'energetic'
 *     },
 *   }}
 * />
 *
 * @example
 * // Custom colors (indigo theme)
 * <Timeline3
 *   groups={myGroups}
 *   config={{
 *     colors: {
 *       progress: '#4f46e5',
 *       line: '#6366f1',
 *       circle: '#818cf8',
 *       text: '#e0e7ff',
 *     },
 *   }}
 * />
 *
 * @example
 * // Compact layout with reduced spacing
 * <Timeline3
 *   groups={myGroups}
 *   config={{
 *     layout: {
 *       itemSpacing: '3rem',
 *       circleSize: '4.5rem',
 *       contentPadding: '5rem',
 *     },
 *   }}
 * />
 *
 * @example
 * // Custom per-animation-type easing
 * <Timeline3
 *   groups={myGroups}
 *   config={{
 *     animations: {
 *       duration: 800,
 *       easing: {
 *         circle: 'cubic-bezier(0.1, 0.7, 0.3, 1)',
 *         line: 'cubic-bezier(0.4, 0.8, 0.2, 1)',
 *         text: 'cubic-bezier(0.3, 0.6, 0.1, 1)',
 *       },
 *     },
 *   }}
 * />
 */
export default function Timeline3({
  groups,
  title = 'Sonicboom Process',
  config,
}: Timeline3Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const headingId = useId();
  const [progress, setProgress] = useState(0);
  const itemRefsMap = useRef<Map<string, HTMLLIElement>>(new Map());
  
  // Merge config with defaults once
  const mergedConfig = mergeConfig(config);

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
    
    // Calculate easing factor based on animation duration
    // Default 0.18 factor for 900ms; scale linearly for other durations
    const easingFactor = 0.18 * (900 / mergedConfig.animations.duration);

    const paint = () => {
      frame = 0;
      current += (target - current) * easingFactor;

      if (Math.abs(target - current) < 0.001) {
        current = target;
      }

      progressElement.style.height = `${current * 100}%`;
      setProgress(current);

      if (current !== target) {
        frame = requestAnimationFrame(paint);
      }
    };

    const updateItemVisibility = () => {
      const rootRect = root.getBoundingClientRect();
      const rootTop = rootRect.top;
      const rootHeight = rootRect.height;
      
      itemRefsMap.current.forEach((itemElement, _id) => {
        const itemRect = itemElement.getBoundingClientRect();
        const itemCenterY = itemRect.top + itemRect.height / 2;
        const itemCenterRelative = itemCenterY - rootTop;
        
        // Posición de la línea de progreso (0-1 = arriba-abajo)
        const progressY = current * rootHeight;
        
        // Distancia del item al progreso (positivo = abajo, negativo = arriba)
        const distanceToProgress = itemCenterRelative - progressY;
        
        // Rango de activación: ±200px
        const activationRange = 200;
        const isActive = Math.abs(distanceToProgress) < activationRange;
        
        // Calcular qué tan "tocado" está el círculo (0 = línea no lo toca, 1 = línea lo toca exactamente)
        let touchProgress = 0;
        if (isActive) {
          touchProgress = 1 - (Math.abs(distanceToProgress) / activationRange);
        }
        
        // Aro del círculo: animar de 0 a 360 grados (usando dashoffset)
        // touchProgress 0 = 100% offset (invisible), 1 = 0% offset (visible completo)
        const circleDashOffset = 100 * (1 - touchProgress);
        
        const circlePath = itemElement.querySelector('.timeline3__circle-path') as SVGCircleElement | null;
        if (circlePath) {
          const transitionDuration = mergedConfig.animations.duration / 1000;
          const easing = typeof mergedConfig.animations.easing === 'string' 
            ? mergedConfig.animations.easing 
            : mergedConfig.animations.easing.circle;
          circlePath.style.transition = `stroke-dashoffset ${transitionDuration}s ${easing}`;
          circlePath.style.strokeDashoffset = `${circleDashOffset}`;
        }
        
        // Línea radial: crece desde el aro cuando touchProgress > 0
        const radialLine = itemElement.querySelector('.timeline3__radial-line') as SVGLineElement | null;
        if (radialLine) {
          // touchProgress 0 = 0% (línea no visible), 1 = 100% (línea completa)
          const lineDashOffset = 100 * (1 - touchProgress);
          const transitionDuration = mergedConfig.animations.duration / 1000;
          const easing = typeof mergedConfig.animations.easing === 'string' 
            ? mergedConfig.animations.easing 
            : mergedConfig.animations.easing.line;
          radialLine.style.transition = `stroke-dashoffset ${transitionDuration}s ${easing}`;
          radialLine.style.strokeDashoffset = `${lineDashOffset}`;
        }
        
        // Marcar visible para texto
        const isVisible = itemRect.top < window.innerHeight * 0.8 && itemRect.bottom > 0;
        if (isVisible && !itemElement.hasAttribute('data-visible')) {
          itemElement.setAttribute('data-visible', '');
        } else if (!isVisible && itemElement.hasAttribute('data-visible')) {
          itemElement.removeAttribute('data-visible');
        }
      });
    };

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target =
        scrollable > 0
          ? Math.max(0, Math.min(1, -rect.top / scrollable))
          : 0;

      updateItemVisibility();

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
  }, [groups.length, mergedConfig.animations.duration]);

  if (!groups.length) {
    return null;
  }

  let phaseIndex = 0;

  return (
    <section
      ref={rootRef}
      className="timeline3"
      aria-labelledby={headingId}
      style={{
        '--timeline3-progress': progress,
        '--timeline3-duration': `${mergedConfig.animations.duration}ms`,
        '--timeline3-easing-circle': typeof mergedConfig.animations.easing === 'string' 
          ? mergedConfig.animations.easing 
          : mergedConfig.animations.easing.circle,
        '--timeline3-easing-line': typeof mergedConfig.animations.easing === 'string' 
          ? mergedConfig.animations.easing 
          : mergedConfig.animations.easing.line,
        '--timeline3-easing-text': typeof mergedConfig.animations.easing === 'string' 
          ? mergedConfig.animations.easing 
          : mergedConfig.animations.easing.text,
        '--timeline3-color-progress': mergedConfig.colors.progress,
        '--timeline3-color-line': mergedConfig.colors.line,
        '--timeline3-color-circle': mergedConfig.colors.circle,
        '--timeline3-color-text': mergedConfig.colors.text,
        '--timeline3-layout-item-spacing': mergedConfig.layout.itemSpacing,
        '--timeline3-layout-circle-size': mergedConfig.layout.circleSize,
        '--timeline3-layout-content-padding': mergedConfig.layout.contentPadding,
      } as CSSProperties}
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
                      ref={(el) => {
                        if (el) {
                          itemRefsMap.current.set(phase.id, el);
                        } else {
                          itemRefsMap.current.delete(phase.id);
                        }
                      }}
                      className={`timeline3__item timeline3__item--${side}`}
                      data-animate="item"
                    >
                      <div className="timeline3__content">
                        <h3>{phase.title}</h3>

                        <div className="timeline3__time">
                          {side === 'left' ? (
                            <div className="timeline3__line" aria-hidden="true">
                              <svg viewBox="0 0 100 10" preserveAspectRatio="none">
                                <line
                                  className="timeline3__line-path"
                                  x1="0"
                                  y1="5"
                                  x2="100"
                                  y2="5"
                                  pathLength={100}
                                />
                              </svg>
                            </div>
                          ) : null}

                          <div className="timeline3__circle">
                            <svg
                              viewBox="0 0 100 100"
                              focusable="false"
                              aria-hidden="true"
                            >
                              {/* Circular arc (0-360 degrees) */}
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
                            
                            {/* Radial line emanating from circle */}
                            <svg
                              className={`timeline3__circle-radial timeline3__circle-radial--${side}`}
                              viewBox="0 0 100 100"
                              focusable="false"
                              aria-hidden="true"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              {side === 'right' ? (
                                // Impares: línea emana del punto 90° (arriba) del aro hacia la derecha
                                // Punto 90°: (50, 1) [borde superior], crece hacia (100, 1)
                                <line
                                  className="timeline3__radial-line"
                                  x1="50"
                                  y1="1"
                                  x2="100"
                                  y2="1"
                                  pathLength={100}
                                />
                              ) : (
                                // Pares: línea emana del punto 270° (abajo) del aro hacia la izquierda
                                // Punto 270°: (50, 99) [borde inferior], crece hacia (0, 99)
                                <line
                                  className="timeline3__radial-line"
                                  x1="50"
                                  y1="99"
                                  x2="0"
                                  y2="99"
                                  pathLength={100}
                                />
                              )}
                            </svg>
                          </div>

                          {side === 'right' ? (
                            <div className="timeline3__line" aria-hidden="true">
                              <svg viewBox="0 0 100 10" preserveAspectRatio="none">
                                <line
                                  className="timeline3__line-path"
                                  x1="0"
                                  y1="5"
                                  x2="100"
                                  y2="5"
                                  pathLength={100}
                                />
                              </svg>
                            </div>
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
