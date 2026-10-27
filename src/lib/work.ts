import { getCollection, type CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;

/** All projects in My Works order. */
export async function allWork(): Promise<WorkEntry[]> {
  return (await getCollection("work")).sort((a, b) => a.data.order - b.data.order);
}

/** Published case studies (have a page), in order. */
export async function caseStudies(): Promise<WorkEntry[]> {
  return (await allWork()).filter((e) => e.data.status === "published");
}

/** Case studies under NDA (locked behind the shared password), in order. */
export async function ndaStudies(): Promise<WorkEntry[]> {
  return (await caseStudies()).filter((e) => e.data.nda);
}

/** The pop-up's list: address → project name, e.g. { "/cna": "CNA (Mediacorp)" }. */
export async function ndaProjects(): Promise<Record<string, string>> {
  return Object.fromEntries((await ndaStudies()).map((e) => [`/${e.id}`, e.data.pager?.label ?? e.data.card.tag]));
}

/** Previous / next case study. The first has no "previous"; the last loops back to the first. */
export function neighbours(list: WorkEntry[], id: string) {
  const i = list.findIndex((e) => e.id === id);
  return { prev: i > 0 ? list[i - 1] : undefined, next: list.length > 1 ? list[(i + 1) % list.length] : undefined };
}
