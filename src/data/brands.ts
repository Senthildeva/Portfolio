// Brand logos. `parts` = one or more exported Figma layers [id, width, height] that make up the logo.
export type LogoPart = [id: string, w: number, h: number];
export interface Brand {
  name: string;
  parts: LogoPart[];
  tag?: string;
}

// Logo strip on Landing and My Works (Figma: Landing page "Frame 2147225919"), in Figma order.
export const LOGOS: Brand[] = [
  { name: "SBI YONO", parts: [["14086:9781", 150, 40]] },
  { name: "Amazon", parts: [["14086:9782", 107, 36]] },
  { name: "Flipkart", parts: [["14086:9783", 167, 44]] },
  { name: "CNA", parts: [["14086:9853", 108, 36]] },
  { name: "Melisten", parts: [["14086:9862", 106, 36]] },
  { name: "Outgrow", parts: [["14086:9872", 54, 50]] },
  { name: "Jain Irrigation", parts: [["14086:9887", 111, 36]] },
  { name: "mewatch", parts: [["14086:9927", 114, 36]] },
  { name: "Gapblue", parts: [["14086:9938", 150, 36]] },
  { name: "iQuanti", parts: [["14086:9939", 125, 24]] },
  { name: "Jain Farm Fresh", parts: [["14086:9954", 95, 55]] },
  { name: "WayCool", parts: [["14086:9955", 131, 36]] },
  { name: "Taqanal", parts: [["14086:9967", 133, 36]] },
  { name: "Aemco", parts: [["14086:9968", 107, 24]] },
  { name: "Rustic AI", parts: [["14086:9974", 145, 28]] },
  { name: "Rustic Charm", parts: [["14086:9992", 154, 44]] },
  { name: "Danburite", parts: [["14086:9994", 33, 44], ["14086:9995", 110, 28]] },
  { name: "Tenanto", parts: [["14086:9996", 119, 28]] },
];

// Clientele grid (Figma: Clientele "Frame 2147225949").
export const BRANDS: Brand[] = [
  { name: "SBI", tag: "BFSI", parts: [["14102:6834", 150, 40]] },
  { name: "Amazon", tag: "E-Commerce", parts: [["14102:6837", 119, 40]] },
  { name: "Flipkart", tag: "E-Commerce", parts: [["14102:6840", 190, 50]] },
  { name: "CNA", tag: "Media & OTT", parts: [["14102:6912", 120, 40]] },
  { name: "Melisten", tag: "Media & Entertainment", parts: [["14102:6923", 133, 45]] },
  { name: "Outgrow", tag: "Agri-tech", parts: [["14102:6935", 86, 80]] },
  { name: "Jain Irrigation", tag: "Agriculture", parts: [["14102:6952", 154, 50]] },
  { name: "mewatch", tag: "Media & OTT", parts: [["14102:6994", 142, 45]] },
  { name: "Gapblue", tag: "Generative AI Solutions", parts: [["14102:7007", 167, 40]] },
  { name: "iQuanti", tag: "Digital marketing services", parts: [["14102:7010", 156, 30]] },
  { name: "Jain Farm Fresh", tag: "Agriculture", parts: [["14102:7027", 139, 80]] },
  { name: "WayCool", tag: "Agri-tech", parts: [["14102:7030", 163, 45]] },
  { name: "Taqanal", tag: "EV Mobility", parts: [["224399:1850", 133, 36]] },
  { name: "Aemco", tag: "E-Commerce", parts: [["14102:7047", 124, 28]] },
  { name: "Rustic AI", tag: "Generative AI", parts: [["14102:7055", 165, 32]] },
  { name: "Rustic Charm", tag: "E-Commerce", parts: [["14102:7075", 192, 55]] },
  { name: "Danburite", tag: "Business consulting", parts: [["14102:7079", 41, 55], ["14102:7080", 138, 35]] },
  { name: "Tenanto", tag: "Property technology", parts: [["14102:7083", 149, 35]] },
];
