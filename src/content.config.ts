// Every project on the site is one YAML file in src/content/work/ — a full case study, or a "coming soon" card.
// The file name is the page address: cna.yaml → /cna. The schema below checks each file when the site builds,
// so a typo in a block shows up as a clear build error instead of a broken page.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Text that may contain inline HTML: <em>, <b>, <i class="g">, <span class="hl">, <small>. */
const rich = z.string();
const nodeId = z.string().regex(/^I?\d+:\d+(;\d+:\d+)*$/, "Expected a Figma layer id like 13764:3166");
const opt = <T extends z.ZodTypeAny>(t: T) => t.optional();
const titled = z.object({ title: rich, text: rich });

const imageItem = z.object({ img: nodeId, w: opt(z.number()), h: opt(z.number()), alt: opt(z.string()), label: opt(z.string()) });
const videoItem = z.object({ video: z.string(), poster: opt(nodeId), ratio: opt(z.string()), label: opt(z.string()), alt: opt(z.string()) });

export const block = z.discriminatedUnion("type", [
  z.object({ type: z.literal("head"), label: opt(z.string()), num: opt(z.string()), title: opt(rich), sub: opt(z.union([rich, z.array(rich)])) }),
  z.object({ type: z.literal("subhead"), text: z.string() }),
  z.object({ type: z.literal("split"), title: rich, body: z.array(rich), card: z.object({ title: rich, body: rich }) }),
  z.object({
    type: z.literal("stats"),
    grid: opt(z.boolean()),
    caps: opt(z.boolean()),
    items: z.array(z.object({ big: opt(rich), icon: opt(nodeId), label: rich, body: opt(rich), src: opt(rich) })),
  }),
  z.object({
    type: z.literal("callout"),
    tone: opt(z.string()),
    deco: opt(nodeId),
    /** Background image (Figma layer id) and its CSS object-position. */
    bg: opt(nodeId),
    bgPos: opt(z.string()),
    title: rich,
    body: opt(z.union([rich, z.array(rich)])),
    chips: opt(z.array(z.string())),
    quote: opt(rich),
    by: opt(rich),
  }),
  z.object({
    type: z.literal("personas"),
    tint: opt(z.boolean()),
    items: z.array(
      z.object({
        img: nodeId,
        name: z.string(),
        age: z.string(),
        desc: opt(rich),
        quote: opt(rich),
        traits: opt(z.array(z.string())),
        lists: opt(z.record(z.string(), z.array(rich))),
      }),
    ),
  }),
  z.object({
    type: z.literal("points"),
    heading: opt(z.string()),
    one: opt(z.boolean()),
    rule: opt(z.boolean()),
    big: opt(z.boolean()),
    small: opt(z.boolean()),
    items: z.array(z.object({ n: opt(z.number()), kicker: opt(rich), title: opt(rich), text: rich })),
  }),
  z.object({ type: z.literal("table"), head: z.array(z.string()), rows: z.array(z.array(z.string())) }),
  z.object({
    type: z.literal("gallery"),
    title: opt(z.string()),
    rows: z.array(z.array(z.object({ img: opt(nodeId), w: opt(z.number()), h: opt(z.number()), alt: opt(z.string()), label: opt(z.string()), cap: rich }))),
  }),
  z.object({ type: z.literal("principles"), tone: opt(z.string()), items: z.array(titled) }),
  z.object({ type: z.literal("features"), items: z.array(titled) }),
  z.object({ type: z.literal("steps"), items: z.array(titled) }),
  z.object({ type: z.literal("takeaways"), label: z.string(), items: z.array(rich) }),
  z.object({ type: z.literal("tags"), items: z.array(z.string()) }),
  z.object({
    type: z.literal("decision"),
    label: z.string(),
    title: rich,
    text: rich,
    img: nodeId,
    /** The whole 1312×700 Figma frame (screen, notes, arrows, caption) exported as one picture; used when present. */
    frame: opt(nodeId),
    /** Where the screen sits inside the 1312×700 Figma frame. */
    imgX: opt(z.number()),
    imgY: opt(z.number()),
    imgW: opt(z.number()),
    imgH: opt(z.number()),
    alt: opt(z.string()),
    notes: opt(z.array(z.object({ x: z.number(), y: z.number(), t: z.string(), s: z.string() }))),
    arrows: opt(z.array(z.object({ id: nodeId, x: z.number(), y: z.number(), flip: opt(z.enum(["h", "v", "hv"])) }))),
    cap: rich,
  }),
  z.object({
    type: z.literal("image"),
    img: nodeId,
    w: opt(z.number()),
    h: opt(z.number()),
    bleed: opt(z.boolean()),
    radius: opt(z.boolean()),
    fade: opt(z.boolean()),
    alt: opt(z.string()),
    label: opt(z.string()),
    cap: opt(rich),
  }),
  z.object({ type: z.literal("pair"), items: z.array(z.union([videoItem, imageItem])) }),
  z.object({ type: z.literal("video"), bleed: opt(z.boolean()) }).extend(videoItem.shape),
  z.object({ type: z.literal("masonry"), cols: z.array(z.array(z.object({ img: nodeId, h: z.number(), alt: z.string() }))) }),
  z.object({
    type: z.literal("styleguide"),
    colors: opt(z.object({ bg: z.string(), items: z.array(z.object({ name: z.string(), hex: z.string(), tints: z.array(z.string()) })) })),
    face: opt(
      z.object({
        name: z.string(),
        stack: z.string(),
        words: opt(z.array(z.object({ text: z.string(), font: opt(z.string()), lang: opt(z.string()) }))),
        /** "Aa" geometry in Figma px: width, outlined/filled copies' top-left, vertical and horizontal guide positions. */
        specimen: opt(z.object({ w: z.number(), front: z.tuple([z.number(), z.number()]), ghost: z.tuple([z.number(), z.number()]), v: z.tuple([z.number(), z.number()]), h: z.tuple([z.number(), z.number()]) })),
      }),
    ),
    label: opt(z.string()),
    ratio: opt(z.string()),
  }),
  /** A case-specific UI components board (src/components/case-study/boards). */
  z.object({ type: z.literal("board"), name: z.enum(["outgrow", "jain"]) }),
  /** Escape hatch: raw HTML. */
  z.object({ type: z.literal("html"), html: z.string() }),
]);

const section = z.union([
  /** A full-width block outside the content column (banners, edge-to-edge images, masonry). */
  z.object({ full: block }),
  z.object({ band: opt(z.boolean()), id: opt(z.string()), cls: opt(z.string()), blocks: z.array(block) }),
]);

const work = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/work" }),
  schema: z
    .object({
      /** published = has a page; soon = "Coming soon" card only. */
      status: z.enum(["published", "soon"]),
      /** Position on My Works (1 = first). Case-study Previous/Next links follow this order too. */
      order: z.number(),
      /** Show on the landing page. */
      featured: z.boolean().default(false),
      card: z.object({ tag: z.string(), meta: z.string(), title: rich, color: z.string(), img: nodeId, alt: z.string().default("") }),
      seo: opt(z.object({ title: z.string(), description: z.string() })),
      theme: opt(z.enum(["cna", "outgrow", "gnie", "jain"])),
      pager: opt(z.object({ label: z.string(), color: z.string() })),
      hero: opt(z.object({ tag: rich, title: rich, lead: opt(rich), ctas: opt(z.array(z.object({ label: z.string(), href: z.string(), ghost: opt(z.boolean()) }))) })),
      stage: opt(z.object({ img: nodeId, alt: opt(z.string()), meta: z.record(z.string(), z.string()), intro: rich })),
      sections: opt(z.array(section)),
    })
    .superRefine((d, ctx) => {
      if (d.status !== "published") return;
      for (const k of ["seo", "theme", "pager", "hero", "stage", "sections"] as const)
        if (!d[k]) ctx.addIssue({ code: "custom", path: [k], message: `A published case study needs "${k}"` });
    }),
});

export const collections = { work };

export type Block = z.infer<typeof block>;
export type Section = z.infer<typeof section>;
