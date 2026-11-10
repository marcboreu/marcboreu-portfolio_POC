import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import './Timeline4.css';

export type Timeline4Item = {
  id: string;
  year: string;
  names: string[];
};

type Timeline4Props = {
  items: Timeline4Item[];
  heading?: string;
  scrollLength?: number;
};

const VIEW = { width: 1600, height: 880 };
const Y1 = 300;
const Y2 = 610;
const X0 = 300;
const XR = 1500;
const RADIUS = 46;
const XL = 24;
const ARC = (Math.PI * RADIUS) / 2;
const TRACK = `M${X0} ${Y1}H${XR}A${RADIUS} ${RADIUS} 0 0 1 ${XR + RADIUS} ${Y1 + RADIUS}V${Y2 - RADIUS}A${RADIUS} ${RADIUS} 0 0 1 ${XR} ${Y2}H${XL}`;
const TRACK_LENGTH =
  XR - X0 + ARC + (Y2 - Y1 - RADIUS * 2) + ARC + XR - XL;
const PIN_PATH = 'M0-5C-5-13-21-21-21-37A21 21 0 1 1 21-37C21-21 5-13 0-5Z';
const WIDE_QUERY = '(min-width: 640px) and (min-height: 300px) and (orientation: landscape)';

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;
const smoothStep = (from: number, to: number, value: number) => {
  const progress = clamp((value - from) / (to - from));
  return progress * progress * (3 - 2 * progress);
};

export default function Timeline4({
  items,
  heading = 'Timeline',
  scrollLength = 4.6,
}: Timeline4Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const trackRef = useRef<SVGPathElement | null>(null);
  const cameraRef = useRef<SVGGElement | null>(null);
  const tipRef = useRef<SVGGElement | null>(null);
  const entryRefs = useRef<Array<{
    pin: SVGGElement | null;
    label: SVGGElement | null;
    length: number;
  }>>([]);
  const headingId = useId();
  const [wide, setWide] = useState(false);
  const [mobileFill, setMobileFill] = useState(0);

  const entries = useMemo(() => {
    const half = Math.ceil(items.length / 2);
    const top = items.slice(0, half);
    const bottom = items.slice(half);
    const position = (from: number, to: number, index: number, total: number) =>
      total > 1 ? from + (index * (to - from)) / (total - 1) : (from + to) / 2;

    return [
      ...top.map((item, index) => {
        const x = position(400, 1440, index, top.length);
        return { item, x, y: Y1, length: x - X0 };
      }),
      ...bottom.map((item, index) => {
        const x = position(1440, 200, index, bottom.length);
        return { item, x, y: Y2, length: TRACK_LENGTH - (x - XL) };
      }),
    ];
  }, [items]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const list = listRef.current;
    const track = trackRef.current;
    const camera = cameraRef.current;
    const tip = tipRef.current;

    if (!root || !pin || !list || !track || !camera || !tip) {
      return undefined;
    }

    const media = window.matchMedia(WIDE_QUERY);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let current = 0;
    let target = 0;
    let mobileTarget = 0;
    let mobileCurrent = 0;

    const updateWide = () => {
      const rect = pin.getBoundingClientRect();
      const scrollable = root.offsetHeight - window.innerHeight;
      target = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;

      const progress = current;
      const drawnLength = TRACK_LENGTH * clamp((progress - 0.03) / 0.8);
      track.style.strokeDashoffset = String(TRACK_LENGTH - drawnLength);

      const tipPoint = track.getPointAtLength(drawnLength);
      tip.setAttribute('transform', `translate(${tipPoint.x} ${tipPoint.y})`);
      tip.style.opacity = String(1 - smoothStep(0.84, 0.9, progress));

      entryRefs.current.forEach((entry) => {
        if (!entry.pin || !entry.label) return;
        const reveal = clamp((drawnLength - entry.length + 50) / 120);
        const overshoot =
          reveal < 1
            ? 1 + 2.2 * (reveal - 1) ** 3 + 1.2 * (reveal - 1) ** 2
            : 1;

        entry.pin.style.opacity = String(Math.min(1, reveal * 2));
        entry.pin.setAttribute(
          'transform',
          `translate(0 ${(1 - reveal) * -34}) scale(${Math.max(0.001, overshoot)})`,
        );
        entry.label.style.opacity = String(clamp((reveal - 0.35) / 0.65));
        entry.label.setAttribute(
          'transform',
          `translate(0 ${(1 - reveal) * 16})`,
        );
      });

      const aheadPoint = track.getPointAtLength(
        Math.min(TRACK_LENGTH, drawnLength + 170),
      );
      const zoomOut = smoothStep(0.8, 0.96, progress);
      const baseScale = clamp(1.33 / Math.min(pin.clientWidth / VIEW.width, pin.clientHeight / VIEW.height), 1.55, 2.6);
      const scale = lerp(baseScale, 1, zoomOut);
      const lift = (110 * 1.55) / baseScale;
      const followY = lerp(0, aheadPoint.y + lift, smoothStep(0, 0.1, progress));
      const centerX = clamp(
        lerp(aheadPoint.x, VIEW.width / 2, zoomOut),
        VIEW.width / 2 / scale,
        VIEW.width - VIEW.width / 2 / scale,
      );
      const centerY = clamp(
        lerp(followY, VIEW.height / 2, zoomOut),
        VIEW.height / 2 / scale,
        VIEW.height - VIEW.height / 2 / scale,
      );

      camera.setAttribute(
        'transform',
        `translate(${VIEW.width / 2 - centerX * scale} ${VIEW.height / 2 - centerY * scale}) scale(${scale})`,
      );
    };

    const updateMobile = () => {
      const rect = list.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      mobileTarget =
        scrollable > 0
          ? clamp((window.innerHeight * 0.6 - rect.top) / scrollable)
          : 0;
      mobileCurrent += (mobileTarget - mobileCurrent) * 0.18;
      setMobileFill(mobileCurrent);
    };

    const update = () => {
      if (media.matches) {
        updateWide();
      } else {
        updateMobile();
      }
    };

    const loop = () => {
      frame = 0;
      update();

      const stillAnimating =
        (media.matches && Math.abs(target - current) > 0.001) ||
        (!media.matches && Math.abs(mobileTarget - mobileCurrent) > 0.001);

      if (stillAnimating && !reducedMotion.matches) {
        frame = requestAnimationFrame(loop);
      }
    };

    const configure = () => {
      setWide(media.matches);
      track.style.strokeDasharray = String(TRACK_LENGTH);

      if (reducedMotion.matches) {
        track.style.strokeDashoffset = '0';
        tip.style.opacity = '0';
        entryRefs.current.forEach((entry) => {
          if (!entry.pin || !entry.label) return;
          entry.pin.style.opacity = '1';
          entry.pin.setAttribute('transform', 'translate(0 0) scale(1)');
          entry.label.style.opacity = '1';
          entry.label.setAttribute('transform', 'translate(0 0)');
        });
        camera.setAttribute('transform', '');
        setMobileFill(1);
        return;
      }

      if (!frame) {
        frame = requestAnimationFrame(loop);
      }
    };

    configure();
    window.addEventListener('scroll', configure, { passive: true });
    window.addEventListener('resize', configure);
    media.addEventListener('change', configure);
    reducedMotion.addEventListener('change', configure);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener('scroll', configure);
      window.removeEventListener('resize', configure);
      media.removeEventListener('change', configure);
      reducedMotion.removeEventListener('change', configure);
    };
  }, [items.length, scrollLength]);

  if (!items.length) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className={`timeline4${wide ? ' timeline4--wide' : ''}`}
      aria-labelledby={headingId}
      style={{ '--timeline4-fill': mobileFill } as CSSProperties}
    >
      <div ref={pinRef} className="timeline4__pin">
        <svg
          className="timeline4__svg"
          viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="timeline4-glow">
              <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="0.35" stopColor="#ffe9a8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g ref={cameraRef} className="timeline4__camera">
            <text
              className="timeline4__heading"
              transform={`translate(236 ${Y1 - 4}) rotate(-90)`}
            >
              {heading}
            </text>

            <g transform={`translate(262 ${Y1 - 92})`}>
              <path
                d="M40 0l34 30-34 30H62l34-30L62 0z"
                fill="#fff"
                opacity="0.28"
              />
              <path
                className="timeline4__chevron"
                d="M0 14l18 16L0 46h11l18-16L11 14zM20 14l18 16-18 16h11l18-16-18-16z"
              />
            </g>

            <path className="timeline4__track-ghost" d={TRACK} />
            <path
              ref={trackRef}
              className="timeline4__track"
              d={TRACK}
            />

            {entries.map((entry, index) => (
              <g
                key={entry.item.id}
                className="timeline4__entry"
                transform={`translate(${entry.x} ${entry.y})`}
              >
                <g
                  ref={(element) => {
                    entryRefs.current[index] = {
                      ...entryRefs.current[index],
                      pin: element,
                      length: entry.length,
                    };
                  }}
                  className="timeline4__pin-group"
                >
                  <path className="timeline4__pin-shape" d={PIN_PATH} />
                  <text className="timeline4__year" x="0" y="-32">
                    {entry.item.year}
                  </text>
                </g>

                <g
                  ref={(element) => {
                    entryRefs.current[index] = {
                      ...entryRefs.current[index],
                      label: element,
                      length: entry.length,
                    };
                  }}
                  className="timeline4__label-group"
                >
                  <g transform="translate(0 18) rotate(-90)">
                    <text className="timeline4__label" textAnchor="end">
                      {entry.item.names.map((name, nameIndex) => (
                        <tspan
                          key={`${entry.item.id}-${nameIndex}`}
                          x="0"
                          dy={nameIndex === 0 ? 0 : 18}
                        >
                          {name}
                        </tspan>
                      ))}
                    </text>
                  </g>
                </g>

                <title>
                  {`${entry.item.year}: ${entry.item.names.join(', ')}`}
                </title>
              </g>
            ))}

            <g ref={tipRef} className="timeline4__tip">
              <circle className="timeline4__tip-glow" r="26" />
              <circle className="timeline4__tip-dot" r="4.5" />
            </g>
          </g>
        </svg>

        <div className="timeline4__mobile">
          <h2 className="timeline4__mobile-heading" id={headingId}>
            {heading}
          </h2>

          <ol ref={listRef} className="timeline4__list">
            {items.map((item) => (
              <li key={item.id} className="timeline4__list-item">
                <span className="timeline4__badge">{item.year}</span>
                <span className="timeline4__names">
                  {item.names.map((name, index) => (
                    <span key={`${item.id}-${index}`}>{name}</span>
                  ))}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
