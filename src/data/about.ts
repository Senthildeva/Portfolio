// About page content that comes in lists.

export interface Job {
  when: string;
  company: string;
  role: string;
  current?: boolean;
  /** One-line summary of the role (still to be written). */
  summary?: string;
}

export const EXPERIENCE: Job[] = [
  { when: "June 2026 - Present", current: true, company: "BORN XDS (A Tech Mahindra company)", role: "Associate UX Designer | Product Designer" },
  { when: "Jun 23 - Jul 25", company: "Mikado UX/UI & Branding Studio", role: "Product Designer" },
  { when: "May 22 - Jun 23", company: "Pebels - Digital Experience Studio", role: "Junior Product Designer" },
];

export const EXPERTISE: [title: string, chips: string[]][] = [
  ["Design", ["Product Design", "User Research", "UX Design", "Interaction Design", "Design Systems", "User Centric", "Business Lens", "UI Design", "Prototyping"]],
  ["Expertise", ["BFSI", "OTT Platforms", "E-commerce", "Agri-tech", "Media & Entertainment", "Enterprise SaaS", "EV - Mobility", "Generative AI", "Consulting, Marketing"]],
  ["Tools", ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Framer", "Claude AI", "Lovable AI", "ChatGPT"]],
  ["Currently exploring", ["AI-Augmented Design", "Fintech", "Design Leadership", "Claude Entire Suite", "Agentic AI"]],
];

/** "Off the clock" photos (Figma layer ids). */
export const OFF_CLOCK = ["14218:10264", "14218:10265", "14218:10266", "14218:10267", "14218:10268", "14218:10269"];
