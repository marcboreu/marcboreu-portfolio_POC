import {
  useEffect,
  useRef,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import "./ScrollDrawnTimeline.css";

export type TimelineEntry = {
  year: string;
  names: string[];
};

type ScrollDrawnTimelineProps = {
  entries: TimelineEntry[];
  heading?: string;
  scrollLength?: number;
  smoothScroll?: boolean;
  children?: ReactNode;
};

// SVG constants - the U-shaped path
const VW = 1600,
  VH = 880;
const Y1 = 300,
  Y2 = 610,
  X0 = 300,
  XR = 1500,
  R = 46,
  XL = 24;
const ARC = Math.PI * R / 2;
const TRACK = `M${X0} ${Y1}H${XR}A${R} ${R} 0 0 1 ${XR + R} ${Y1 + R}V${Y2 - R}A${R} ${R} 0 0 1 ${XR} ${Y2}H${XL}`;
const TRACK_LEN = (XR - X0) + ARC + (Y2 - Y1 - 2 * R) + ARC + (XR - XL);
const PIN = "M0-5C-5-13-21-21-21-37A21 21 0 1 1 21-37C21-21 5-13 0-5Z";

// Helpers
const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function wrap(name: string, labelChars = 19): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of name.split(/\s+/)) {
    if (line && (line + " " + word).length > labelChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + " " + word : word;
    }
  }
  return line ? lines.concat(line) : lines;
}

type PinData = {
  pin: SVGGElement | null;
  label: SVGGElement | null;
  len: number;
};

/**
 * ScrollDrawnTimeline - A U-shaped timeline that draws itself as you scroll
 * Converts to React and replaces GSAP with scroll tracking
 */
export default function ScrollDrawnTimeline({
  entries,
  heading = "Timeline",
  scrollLength = 4.6,
  smoothScroll = true,
}: ScrollDrawnTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pinRef = useRef<SVGGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGGElement>(null);
  const chevsRef = useRef<SVGGElement>(null);

  const [progress, setProgress] = useState(0);
  const [isWide, setIsWide] = useState(false);
  const pinsDataRef = useRef<PinData[]>([]);

  const half = Math.ceil(entries.length / 2);
  const topEntries = useMemo(() => entries.slice(0, half), [entries, half]);
  const bottomEntries = useMemo(() => entries.slice(half), [entries, half]);

  // Check for reduced motion
  const prefersReducedMotion = useMemo(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Build SVG structure
  useEffect(() => {
    if (!pinRef.current) return;

    const cam = pinRef.current;
    cam.innerHTML = "";

    // Clear pins data
    pinsDataRef.current = [];

    // Add heading
    const headingText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    headingText.setAttribute("class", "tl-heading");
    headingText.setAttribute(
      "transform",
      `translate(236 ${Y1 - 4}) rotate(-90)`
    );
    headingText.textContent = heading;
    cam.appendChild(headingText);

    // Add chevrons
    const chevsGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    chevsGroup.setAttribute("transform", `translate(262 ${Y1 - 92})`);
    chevsRef.current = chevsGroup;

    const chevBg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    chevBg.setAttribute(
      "d",
      "M40 0l34 30-34 30H62l34-30L62 0z"
    );
    chevBg.setAttribute("fill", "#fff");
    chevBg.setAttribute("opacity", ".28");
    chevsGroup.appendChild(chevBg);

    const chevFg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    chevFg.setAttribute("class", "tl-chev");
    chevFg.setAttribute(
      "d",
      "M0 14l18 16L0 46h11l18-16L11 14zM20 14l18 16-18 16h11l18-16-18-16z"
    );
    chevsGroup.appendChild(chevFg);
    cam.appendChild(chevsGroup);

    // Add track ghost
    const trackGhost = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    trackGhost.setAttribute("class", "tl-track-ghost");
    trackGhost.setAttribute("d", TRACK);
    cam.appendChild(trackGhost);

    // Add main track
    const track = document.createElementNS("http://www.w3.org/2000/svg", "path");
    track.setAttribute("class", "tl-track");
    track.setAttribute("d", TRACK);
    track.style.strokeDasharray = String(TRACK_LEN);
    trackRef.current = track;
    cam.appendChild(track);

    // Helper for positioning
    const step = (a: number, b: number, n: number, i: number) =>
      n > 1 ? a + (i * (b - a)) / (n - 1) : (a + b) / 2;

    // Add top entries (left → right)
    topEntries.forEach((entry, i) => {
      const x = step(400, 1440, topEntries.length, i);
      const entryLen = x - X0;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "tl-entry");
      g.setAttribute("transform", `translate(${x} ${Y1})`);

      // Pin
      const pinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const pinPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pinPath.setAttribute("class", "tl-pinshape");
      pinPath.setAttribute("d", PIN);
      pinG.appendChild(pinPath);

      const yearText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      yearText.setAttribute("class", "tl-year");
      yearText.setAttribute("x", "0");
      yearText.setAttribute("y", "-32");
      yearText.textContent = entry.year;
      pinG.appendChild(yearText);
      g.appendChild(pinG);

      // Label
      const labelG = createLabel(entry);
      g.appendChild(labelG);

      // Title for tooltip
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${entry.year}: ${entry.names.join(", ")}`;
      g.appendChild(title);

      cam.appendChild(g);
      pinsDataRef.current.push({ pin: pinG, label: labelG, len: entryLen });
    });

    // Add bottom entries (right → left)
    bottomEntries.forEach((entry, i) => {
      const x = step(1440, 200, bottomEntries.length, i);
      const entryLen = TRACK_LEN - (x - XL);
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "tl-entry");
      g.setAttribute("transform", `translate(${x} ${Y2})`);

      const pinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const pinPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pinPath.setAttribute("class", "tl-pinshape");
      pinPath.setAttribute("d", PIN);
      pinG.appendChild(pinPath);

      const yearText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      yearText.setAttribute("class", "tl-year");
      yearText.setAttribute("x", "0");
      yearText.setAttribute("y", "-32");
      yearText.textContent = entry.year;
      pinG.appendChild(yearText);
      g.appendChild(pinG);

      const labelG = createLabel(entry);
      g.appendChild(labelG);

      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${entry.year}: ${entry.names.join(", ")}`;
      g.appendChild(title);

      cam.appendChild(g);
      pinsDataRef.current.push({ pin: pinG, label: labelG, len: entryLen });
    });

    // Add tip (glowing point that follows the line)
    const tipG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const tipGlow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    tipGlow.setAttribute("class", "tl-tip-glow");
    tipGlow.setAttribute("r", "26");
    tipG.appendChild(tipGlow);

    const tipDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    tipDot.setAttribute("class", "tl-tip");
    tipDot.setAttribute("r", "4.5");
    tipG.appendChild(tipDot);
    tipRef.current = tipG;
    cam.appendChild(tipG);
  }, [entries, heading, topEntries, bottomEntries]);

  // Helper to create labels
  function createLabel(entry: TimelineEntry): SVGGElement {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const rows = entry.names.flatMap((name, n) =>
      (n ? [null] : []).concat(wrap(name, 19))
    );
    const width = rows.reduce(
      (w, r) => w + (r === null ? 8 : 15),
      0
    );

    const col = document.createElementNS("http://www.w3.org/2000/svg", "g");
    col.setAttribute("transform", "translate(0 18) rotate(-90)");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("class", "tl-label");
    text.setAttribute("text-anchor", "end");

    let cur = -width / 2;
    rows.forEach((r) => {
      if (r === null) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("class", "tl-sep");
        line.setAttribute("x1", "-118");
        line.setAttribute("x2", "0");
        line.setAttribute("y1", String(cur + 3));
        line.setAttribute("y2", String(cur + 3));
        col.appendChild(line);
      } else {
        const tspan = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan"
        );
        tspan.setAttribute("x", "0");
        tspan.setAttribute("y", String(cur + 11));
        tspan.textContent = r;
        text.appendChild(tspan);
      }
      cur += r === null ? 8 : 15;
    });

    col.appendChild(text);
    label.appendChild(col);
    return label;
  }

  // Detect wide layout
  useEffect(() => {
    const query = matchMedia(
      "(min-width: 640px) and (min-height: 300px) and (orientation: landscape)"
    );
    setIsWide(query.matches);

    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  // Measure SVG and calculate zoom
  const measureRef = useRef(() => 1);
  useEffect(() => {
    if (!svgRef.current) return;

    const measure = () => {
      const r = svgRef.current!.getBoundingClientRect();
      const scale = Math.min(r.width / VW, r.height / VH);
      return clamp(1.33 / scale, 1.55, 2.6);
    };

    measureRef.current = measure;
  }, []);

  // Scroll tracking
  useEffect(() => {
    if (!isWide || !containerRef.current) return;

    const container = containerRef.current;
    const scrollLengthPx = window.innerHeight * scrollLength;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollProgress = Math.max(0, -rect.top) / scrollLengthPx;
      const normalizedProgress = Math.min(1, scrollProgress);
      setProgress(normalizedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isWide, scrollLength]);

  // Update SVG based on progress
  useEffect(() => {
    if (!isWide || !trackRef.current || !tipRef.current) return;

    const p = progress;
    const len = TRACK_LEN * clamp((p - 0.03) / 0.8, 0, 1);
    trackRef.current.style.strokeDashoffset = String(TRACK_LEN - len);

    // Get point at length along the path
    const pt = trackRef.current.getPointAtLength(len);
    tipRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    tipRef.current.style.opacity = String(1 - smoothstep(0.84, 0.9, p));

    // Update pins
    pinsDataRef.current.forEach((e) => {
      const k = clamp((len - e.len + 50) / 120, 0, 1);
      const kb = k < 1 ? 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2 : 1;

      if (e.pin) {
        e.pin.style.opacity = String(Math.min(1, k * 2));
        e.pin.setAttribute(
          "transform",
          `translate(0 ${(1 - k) * -34}) scale(${Math.max(0.001, kb)})`
        );
      }

      if (e.label) {
        e.label.style.opacity = String(clamp((k - 0.35) / 0.65, 0, 1));
        e.label.setAttribute("transform", `translate(0 ${(1 - k) * 16})`);
      }
    });

    // Camera animation
    const Z0 = measureRef.current();
    const lift = 110 * 1.55 / Z0;
    const ahead = trackRef.current.getPointAtLength(
      Math.min(TRACK_LEN, len + 170)
    );
    const zk = smoothstep(0.8, 0.96, p);
    const z = lerp(Z0, 1, zk);
    const follow = lerp(0, ahead.y + lift, smoothstep(0, 0.1, p));
    const cx = clamp(
      lerp(ahead.x, VW / 2, zk),
      (VW / 2) / z,
      VW - (VW / 2) / z
    );
    const cy = clamp(
      lerp(follow, VH / 2, zk),
      (VH / 2) / z,
      VH - (VH / 2) / z
    );

    if (pinRef.current) {
      pinRef.current.setAttribute(
        "transform",
        `translate(${VW / 2 - cx * z} ${VH / 2 - cy * z}) scale(${z})`
      );
    }
  }, [progress, isWide]);

  // Chevron animation
  useEffect(() => {
    if (prefersReducedMotion || !chevsRef.current) return;

    const chevs = chevsRef.current;
    let animationFrameId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) % 1800; // 1.8s cycle
      const t = elapsed / 1800;
      const easeInOut = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      const offset = (easeInOut - 0.5) * 20;
      chevs.setAttribute("transform", `translate(${262 + offset} ${Y1 - 92})`);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReducedMotion]);

  return (
    <div className="scroll-drawn-timeline" ref={containerRef}>
      <div className="tl-pin">
        {isWide && (
          <svg
            ref={svgRef}
            className="tl-svg"
            viewBox={`0 0 ${VW} ${VH}`}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="tl-glow">
                <stop offset="0" stopColor="#fff" stopOpacity=".95" />
                <stop offset=".35" stopColor="#ffe9a8" stopOpacity=".55" />
                <stop offset="1" stopColor="#ffd36b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g ref={pinRef} className="tl-cam" />
          </svg>
        )}

        {/* Vertical list for mobile/accessibility */}
        <div className="tl-mobile" role="region" aria-labelledby="tl-heading">
          <h2 className="tl-list-head" id="tl-heading">
            {heading}
          </h2>
          <ol className="tl-list">
            {entries.map((entry) => (
              <li key={entry.year} className="tl-li">
                <span className="tl-badge">{entry.year}</span>
                <span className="tl-names">
                  {entry.names.map((name, i) => (
                    <span key={i}>
                      {i > 0 && <hr />}
                      {name}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
