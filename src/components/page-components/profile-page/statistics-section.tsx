"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { UserStatistics } from "@/types/stats";

const UserStats = () => {
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://untis-production-0de8.up.railway.app/api/v1/profile/stats",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data: UserStatistics = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-700">Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 py-6 pt-0">
        {loading || !stats ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx} className="rounded-xl shadow-sm">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" /> {/* label */}
                <Skeleton className="h-6 w-16" /> {/* value */}
              </CardContent>
            </Card>
          ))
        ) : (
            <>
            <StatCard
              label="Quizzes Created"
              value={stats.total_quizzes_generated}
            />
            <StatCard
              label="Quizzes Completed"
              value={stats.total_quizzes_completed}
            />
            <StatCard label="Correct Answers" value={stats.correct_answers} />
            <StatCard
              label="Incorrect Answers"
              value={stats.incorrect_answers}
            />
            <StatCard
              label="Success Rate"
              value={`${stats.success_percentage.toFixed(2)}%`}
            />
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

export default UserStats;
