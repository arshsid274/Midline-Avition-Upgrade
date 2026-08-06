/**
 * Midline brand device (client brief §10): a thin champagne flight-path line
 * that draws in slowly and settles into a small waypoint dot. Used under hero
 * headlines, beside section headings, and as the footer divider so the same
 * element recurs across the site. Animation lives in globals.css
 * (.flight-path-draw / .flight-path-dot) and is reduced-motion safe.
 */
export default function FlightPathLine({
  className = "",
  width = 96,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={width}
      height="10"
      viewBox="0 0 96 10"
      fill="none"
    >
      <path
        className="flight-path-draw"
        d="M0 8.5 C 40 8.5, 64 6.5, 92 1.5"
        pathLength={1}
        stroke="#C8A46B"
        strokeWidth="1"
      />
      <circle className="flight-path-dot" cx="93" cy="1.5" r="1.5" fill="#C8A46B" />
    </svg>
  );
}
