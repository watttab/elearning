
export interface NewsItem {
  id: string; // Using UserID as a pseudo-id or generating one
  date: string;
  timestamp: Date;
  userId: string;
  district: string;
  message: string;
  link?: string; // Extracted link if present
  type: 'text' | 'link' | 'mixed';
}

export interface DashboardStats {
  totalPosts: number;
  postsToday: number;
  activeDistrict: string;
  districtCounts: { name: string; count: number }[];
  uniqueDistricts: string[]; // Master list of all known districts
  submittedToday: string[];
  missingToday: string[];
}
