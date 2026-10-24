// Clientele page lists.

/** [Lucide icon name, sector] */
export const SECTORS: [icon: string, label: string][] = [
  ["landmark", "BFSI"],
  ["tv", "OTT Platforms"],
  ["shopping-bag", "E-commerce"],
  ["clapperboard", "Media & Entertainment"],
  ["building-2", "Enterprise SaaS"],
  ["tractor", "Agri-tech"],
  ["plug-zap", "EV - Mobility"],
  ["sparkle", "Generative AI"],
  ["briefcase-business", "Consulting, Marketing"],
];

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  logo: [id: string, alt: string];
  /** Background of the name strip. */
  tint?: string;
  /** Quote; <b> marks the highlighted phrases. */
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sahil Verma",
    role: "Associate Manager - Marketing",
    avatar: "13840:3996",
    logo: ["13840:4001", "iQuanti"],
    quote:
      "I had the pleasure of working with Senthil, and it was an incredibly positive experience. He <b>brings a creative and thoughtful approach</b> to everything he does whether it's designing visuals, developing creatives, or enhancing user experiences. Senthil consistently demonstrates a <b>proactive attitude</b> and is always willing to lend a helping hand. His <b>collaborative spirit</b> and creative mindset make him a <b>valuable asset to any team.</b>",
  },
  {
    name: "Shashwat Verma",
    role: "AI Agents | Adtech@Glance AI | 1x-Founder",
    avatar: "13873:8230",
    logo: ["13873:8235", "Rustic AI"],
    tint: "linear-gradient(90deg,#f6f0ff,#efe9ff)",
    quote:
      "Senthil is a diligent, sincere and fun to work with. He <b>conducts deep competitor research, understands user journeys deeply</b> and structures his work systematically so that it is quick to iterate. I most appreciate his <b>work ethic</b> and would recommend him for any full-time, or freelancing work. He can be trusted with the task!",
  },
];
