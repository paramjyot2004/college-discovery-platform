import collegesData from "../data/colleges";
import { College, DiscussionThread } from "../types";
import { collegeMatchesSearch } from "./search";

export async function getAllColleges(): Promise<College[]> {
  return Promise.resolve(collegesData);
}

export async function getCollegeBySlug(slug: string): Promise<College | null> {
  const found = collegesData.find((c) => c.slug === slug || c.id === slug);
  return Promise.resolve(found || null);
}

export type SearchFilters = {
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  rating?: number;
  type?: string;
  sortBy?: string;
};

export async function searchColleges(filters: SearchFilters = {}): Promise<College[]> {
  const {
    search = "",
    location = "",
    minFees = 0,
    maxFees = 1000000,
    rating = 0,
    type = "",
    sortBy = "rating-desc",
  } = filters;

  let results = collegesData.filter((c) => {
    const matchesSearch = collegeMatchesSearch(
      {
        name: c.name,
        slug: c.slug,
        location: c.location,
        state: (c as any).state || "",
        description: c.description,
        courses: c.courses,
      },
      search
    );

    const matchesLocation = !location || c.location.toLowerCase().includes(location.toLowerCase()) || ((c as any).state || '').toLowerCase().includes(location.toLowerCase());
    const matchesFees = c.fees >= (minFees || 0) && c.fees <= (maxFees || Infinity);
    const matchesRating = c.rating >= (rating || 0);
    const matchesType = !type || (c.type || "").toLowerCase() === type.toLowerCase();

    return matchesSearch && matchesLocation && matchesFees && matchesRating && matchesType;
  });

  if (sortBy === "rating-desc") {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "fees-asc") {
    results.sort((a, b) => a.fees - b.fees);
  } else if (sortBy === "fees-desc") {
    results.sort((a, b) => b.fees - a.fees);
  } else if (sortBy === "placements-desc") {
    const getLpa = (p: string) => parseFloat((p || "").replace(/[^\d.]/g, "")) || 0;
    results.sort((a, b) => getLpa(b.placements) - getLpa(a.placements));
  } else if (sortBy === "reviews-desc") {
    results.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }

  return Promise.resolve(results);
}

export async function compareColleges(ids: string[]): Promise<College[]> {
  const set = new Set(ids);
  return Promise.resolve(collegesData.filter((c) => set.has(c.id) || set.has(c.slug)));
}

const DISCUSSIONS_KEY = "local_discussions";

export function loadDiscussions(): DiscussionThread[] {
  try {
    const raw = localStorage.getItem(DISCUSSIONS_KEY);
    if (raw) return JSON.parse(raw) as DiscussionThread[];
  } catch (e) {
    // ignore
  }
  return [];
}

export function saveDiscussions(threads: DiscussionThread[]) {
  try {
    localStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(threads));
  } catch (e) {
    // ignore
  }
}

export default { getAllColleges, getCollegeBySlug, searchColleges, compareColleges };
