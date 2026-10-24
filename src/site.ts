// Site-wide facts used across pages. Change contact details here once.
export const SITE = {
  name: "Senthil Devaraj",
  url: "https://www.senthildevaraj.co.in",
  email: "senthildevaraj1998@gmail.com",
  phoneDisplay: "+91 90425 67775",
  phoneHref: "+919042567775",
  linkedin: "https://www.linkedin.com/in/senthildevaraj/",
  resume: "/Senthil-Devaraj-Resume.pdf",
};

export const NAV = [
  { href: "/about", label: "About", key: "about" },
  { href: "/work", label: "My Works", key: "work" },
  { href: "/clientele", label: "Clientele", key: "clientele" },
] as const;

export type NavKey = (typeof NAV)[number]["key"] | "";
