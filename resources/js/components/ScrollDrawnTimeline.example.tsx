import ScrollDrawnTimeline, {
  type TimelineEntry,
} from "@/components/ScrollDrawnTimeline";

/**
 * Example Usage of ScrollDrawnTimeline Component
 *
 * A U-shaped timeline that draws itself as you scroll down.
 * The line animates from left → right → left following scroll progress.
 * Perfect for showing company milestones, project history, or event timelines.
 */

// Example data
const COMPANY_HISTORY: TimelineEntry[] = [
  { year: "1976", names: ["Printing & Publishing House"] },
  { year: "1978", names: ["General Trading Company"] },
  { year: "1982", names: ["Neighbourhood Supermarkets"] },
  { year: "1985", names: ["Music & Audio"] },
  { year: "1988", names: ["Artisan Bakery"] },
  { year: "1989", names: ["Seafood Processing"] },
  { year: "1992", names: ["Trading Establishment"] },
  { year: "1993", names: ["Pre-press & Design Studio"] },
  { year: "1995", names: ["Mercantile & Marine Logistics"] },
  { year: "1998", names: ["Food Processing Plant"] },
  { year: "2001", names: ["Family Health Clinic"] },
  { year: "2003", names: ["Furniture Gallery", "The Print House"] },
  { year: "2004", names: ["Foods Division"] },
  { year: "2006", names: ["Music Academy", "Pure Music Store"] },
  { year: "2008", names: ["Industries & Manufacturing"] },
  { year: "2010", names: ["Free Zone Trading Hub"] },
  { year: "2014", names: ["Regional Branch, Qatar"] },
  { year: "2015", names: ["Kids Gym Franchise"] },
  { year: "2016", names: ["Plywood Mill", "Metal & Pipes Manufacturing"] },
  { year: "2018", names: ["Pro Audio Distribution"] },
  { year: "2019", names: ["IT Services", "City Media"] },
  { year: "2021", names: ["Regional Office, KSA"] },
  { year: "2023", names: ["Community Shopping Mall"] },
  { year: "2025", names: ["New Logistics Facility"] },
];

/**
 * Render the ScrollDrawnTimeline component
 * On landscape screens: SVG U-shaped drawing that animates with scroll
 * On portrait/mobile: Vertical list with filled line animation
 */
export function TimelineExample() {
  return (
    <ScrollDrawnTimeline
      entries={COMPANY_HISTORY}
      heading="Our Journey"
      scrollLength={4.6} // Number of screen heights to scroll through the animation
    />
  );
}

export default TimelineExample;
