// About page content that comes in lists.

export interface Job {
  when: string;
  company: string;
  role: string;
  current?: boolean;
  /** The kind of work, in bold under the role (Figma: Inter Semi Bold). */
  focus: string;
  /** What the role involved, as bullet points. */
  points: string[];
}

// From the About page's Experience section in Figma (224467:5889).
export const EXPERIENCE: Job[] = [
  {
    when: "June 2026 - Present",
    current: true,
    company: "BORN XDS (A Tech Mahindra Company)",
    role: "Associate UX Designer | Product Designer",
    focus: "Corporate Banking | UX & Product Solutioning",
    points: [
      "Worked across enterprise corporate banking platforms, covering end-to-end journeys in API Banking, Payments, Beneficiary Management, Account Management, and User Management.",
      "Applied UX research, competitive analysis, and workflow analysis to identify user pain points across customer-facing platforms and employee-facing branch interfaces, informing data-driven design decisions and translating business requirements into effective solutions.",
      "Contributed to design system improvements and collaborated with Product Owners, business stakeholders, UI teams, and frontend engineers to deliver consistent, user-focused banking experiences across customer-facing and employee-facing platforms.",
    ],
  },
  {
    when: "Jun 23 - Jul 25",
    company: "Mikado UX/UI & Branding Studio",
    role: "Product Designer",
    focus: "End-to-End Product Design",
    points: [
      "Designed end-to-end digital experiences across OTT platforms, including Apple TV, infotainment, and web and mobile products, balancing user needs, product requirements, and platform-specific behaviours.",
      "Served as the primary point of contact for key clients, including Amazon, Jain, and iQuanti, aligning stakeholders and engineering teams to deliver cohesive product experiences.",
      "Led design activities spanning UX research, competitor analysis, interaction design, high-fidelity prototyping, and scalable design systems.",
    ],
  },
  {
    when: "May 22 - Jun 23",
    company: "Pebels - Digital Experience Studio",
    role: "Junior UX/UI Designer",
    focus: "Product Design | UI & Visual Design",
    points: [
      "Contributed to mobile product design across agriculture, EV mobility, and financial platforms, translating business requirements into intuitive, user-friendly interfaces.",
      "Created wireframes, icons, illustrations, and UI components while supporting UX research, user-flow mapping, and iterative design improvements in collaboration with the product team.",
    ],
  },
];

export const EXPERTISE: [title: string, chips: string[]][] = [
  ["Design", ["Product Design", "User Research", "UX Design", "Interaction Design", "Design Systems", "User Centric", "Business Lens", "UI Design", "Prototyping"]],
  ["Expertise", ["BFSI", "OTT Platforms", "E-commerce", "Agri-tech", "Media & Entertainment", "Enterprise SaaS", "EV - Mobility", "Generative AI", "Consulting, Marketing"]],
  ["Tools", ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Framer", "Claude AI", "Lovable AI", "ChatGPT"]],
  ["Currently exploring", ["AI-Augmented Design", "Fintech", "Design Leadership", "Claude Entire Suite", "Agentic AI"]],
];

/** "Off the clock" photos: [Figma layer id, description], in Figma order (Pic 1 to Pic 6). */
export const OFF_CLOCK: [string, string][] = [
  ["14218:10264", "Riding gear on, standing beside the motorcycle"],
  ["14218:10265", "Grilled chicken on rice, with the sea behind"],
  ["14218:10266", "At the gym, next to a loaded barbell"],
  ["14218:10267", "Playing football on a turf pitch"],
  ["14218:10268", "Movie time: a popcorn bucket in a dark cinema"],
  ["14218:10269", "Batting at an indoor cricket net"],
];
