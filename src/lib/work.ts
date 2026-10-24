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

/** Previous / next case study. The first has no "previous"; the last loops back to the first. */
export function neighbours(list: WorkEntry[], id: string) {
  const i = list.findIndex((e) => e.id === id);
  return { prev: i > 0 ? list[i - 1] : undefined, next: list.length > 1 ? list[(i + 1) % list.length] : undefined };
}
