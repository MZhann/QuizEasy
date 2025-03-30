"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardStats } from "@/types/leaderboard";

const UserLeaderboardStats = () => {
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardStats = async () => {
      try {
        const response = await fetch(
          "https://untis-production-0de8.up.railway.app/api/v1/profile/leaderboard/me",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard stats");
        }

        const data: LeaderboardStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching leaderboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardStats();
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-700 mt-10">Leaderboard info</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 pt-0">
        {loading || !stats ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <Card key={idx} className="rounded-xl shadow-sm">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" /> {/* label */}
                <Skeleton className="h-6 w-20" /> {/* value */}
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              label="Your Rank"
              value={`#${stats.rank}/${stats.users_count}`}
            />
            <StatCard label="Total Score" value={stats.total_score} />
          </>
        )}
      </div>
    </>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Card className="rounded-xl shadow-sm">
    <CardContent className="p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default UserLeaderboardStats;
