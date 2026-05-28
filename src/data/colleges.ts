// Static colleges dataset for frontend-only deployments
import rawDb from "../../server/db.json";
import { College } from "../types";

// Normalize/ensure fields match the `College` interface used by the app
export const colleges: College[] = (rawDb.colleges || []).map((c: any) => ({
  id: c.id || c.slug || `${(c.name || '').toLowerCase().replace(/\s+/g,'-')}`,
  name: c.name,
  slug: c.slug,
  location: c.location,
  fees: typeof c.fees === 'number' ? c.fees : parseInt(c.fees || '0', 10) || 0,
  rating: typeof c.rating === 'number' ? c.rating : parseFloat(c.rating) || 0,
  placements: typeof c.placements === 'string' ? c.placements : (c.placements ? `${c.placements} LPA` : ''),
  highestPlacement: c.highestPlacement || c.highestPackage || undefined,
  image: c.image || "",
  description: c.description || "",
  courses: c.courses || [],
  established: c.established || 0,
  type: (c.type || c.ownership || "Public") === "Private" ? "Private" : "Public",
  campusSize: c.campusSize || undefined,
  reviewsCount: c.reviewsCount || 0,
}));

export default colleges;
