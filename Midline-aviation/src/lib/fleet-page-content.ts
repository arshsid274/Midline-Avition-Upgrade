/**
 * Fleet index page content, lifted from the components verbatim.
 * Seed source for the Fleet global. The aircraft themselves live in the
 * Aircraft collection, not here.
 */
export const FLEET_PAGE = {
  hero: {
    heading: "Our Exceptional Fleet",
    body: "Experience a new era of aviation excellence with our fully modernized range of aircraft.",
    videoUrl: "/assets/videos/g200-showcase.mp4",
    poster: {
      src: "/assets/images/aircraft/g200-exterior.webp",
      alt: "Gulfstream G200 on the apron",
    },
  },
  comparison: {
    eyebrow: "Specifications",
    heading: "Metrics",
    intro: "",
  },
  interior: {
    heading: "Interior Gallery",
    link: { label: "View Full Fleet Gallery", href: "/gallery" },
    tiles: [
      {
        src: "/assets/images/aircraft/g200-cabin.webp",
        alt: "Gulfstream G200 cabin interior",
        caption: "Gulfstream G200 · Cabin",
      },
      { src: "/assets/images/aircraft/g450-dining.webp", alt: "Dining service aboard the G450" },
      { src: "/assets/images/aircraft/g450-exterior.webp", alt: "Gulfstream G450 exterior" },
      {
        src: "/assets/images/aircraft/legacy650-exterior.webp",
        alt: "Embraer Legacy 650 exterior",
      },
    ],
  },
};
