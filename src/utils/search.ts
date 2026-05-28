export type SearchableCollege = {
  name?: string;
  slug?: string;
  location?: string;
  state?: string;
  description?: string;
  courses?: string[];
};

function toText(s?: string) {
  return (s || "").toLowerCase();
}

function initialsOf(phrase: string) {
  return phrase
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0] || "")
    .join("")
    .toLowerCase();
}

export function buildSearchTokens(query?: string) {
  if (!query) return [];
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

export function collegeMatchesSearch(college: SearchableCollege, query?: string) {
  const tokens = buildSearchTokens(query);
  if (tokens.length === 0) return true; // empty search matches everything

  const name = toText(college.name);
  const slug = toText(college.slug);
  const location = toText(college.location);
  const state = toText(college.state);
  const description = toText(college.description);
  const coursesJoined = (college.courses || []).map(toText);

  // Prepare a list of searchable strings
  const fields = [name, slug, location, state, description, ...coursesJoined];

  // Also prepare initials for name and for each course
  const nameInitials = initialsOf(name);
  const courseInitials = coursesJoined.map(initialsOf);

  // Token must match at least one field (partial, case-insensitive), or match initials of multi-word phrases
  const tokenMatches = (token: string) => {
    if (!token) return true;

    // direct substring match across fields
    for (const f of fields) {
      if (f.includes(token)) return true;
    }

    // check initials match (e.g., 'cs' -> 'computer science')
    if (nameInitials.includes(token)) return true;
    for (const ci of courseInitials) {
      if (ci.includes(token)) return true;
    }

    // also check initials of state/location
    if (initialsOf(location).includes(token)) return true;
    if (initialsOf(state).includes(token)) return true;

    return false;
  };

  // require all tokens to match (AND semantics) to support multi-word queries like "iit delhi"
  return tokens.every(tokenMatches);
}

export default {
  buildSearchTokens,
  collegeMatchesSearch,
};
