export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  fees: number; // Annual fees in INR
  rating: number; // Out of 5
  placements: string; // Average placement package (e.g. "32.4 LPA")
  highestPlacement?: string; // Highest placement package (e.g. "3.1 Cr")
  image: string;
  description: string;
  courses: string[];
  established: number;
  type: 'Public' | 'Private';
  campusSize?: string;
  reviewsCount: number;
  reviews?: CollegeReview[];
}

export interface CollegeReview {
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: string;
}

export interface CollegeFilter {
  search: string;
  location: string[];
  feesRange: [number, number];
  minRating: number;
  sortBy: string;
}

export interface DiscussionAnswer {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  title: string;
  body: string;
  collegeSlug: string;
  collegeName: string;
  author: string;
  createdAt: string;
  answers: DiscussionAnswer[];
}
