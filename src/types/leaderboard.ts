export interface LeaderboardStats {
  rank: number;
  total_score: number;
  users_count: number;
}

export interface LeaderboardUser {
  _id: string;
  first_name: string;
  last_name: string;
  total_score: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  users_count: number;
}
