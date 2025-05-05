"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardStats, LeaderboardUser } from "@/types/leaderboard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Image from "next/image";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const LIMIT = 10;

const LeaderboardPage = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);

  const fetchLeaderboard = async (page: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * LIMIT;
      const res = await fetch(
        `https://untis-production-0de8.up.railway.app/api/v1/profile/leaderboard?skip=${skip}&limit=${LIMIT}`
      );
      const data = await res.json();
      setUsers(data.users);
      setTotalUsers(data.users_count);
    } catch (err) {
      console.error("Leaderboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyStats = async () => {
    try {
      const res = await fetch(
        "https://untis-production-0de8.up.railway.app/api/v1/profile/leaderboard/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("My leaderboard stats fetch error", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
    fetchMyStats();
  }, [page]);

  const totalPages = Math.ceil(totalUsers / LIMIT);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="flex items-center gap-4 mt-5">
        <Image
          src={"/assets/images/decoration/mini-man.png"}
          width={70}
          height={70}
          alt="mini man"
        />
        <p className="text-lg leading-5 text-gray-500 mt-2 italic">
          &quot;Here you can see the {" "}
          <span className="text-cyan-700 font-bold">leaderboard</span>. <br/> You can keep track of everyone&apos;s position in this <span className="text-cyan-700 font-bold">knowledge race</span>!&quot;
        </p>
      </div>

      {/* User personal stats */}
      {stats && (
        <div className="mb-6 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label="Your Rank"
            value={`#${stats.rank}/${stats.users_count}`}
          />
          <StatCard label="Your Score" value={stats.total_score} />
        </div>
      )}

      {/* Leaderboard list */}
      <div className="grid gap-4">
        {loading
          ? Array.from({ length: LIMIT }).map((_, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))
          : users.map((user, index) => {
              const rank = (page - 1) * LIMIT + index + 1;
              return (
                <Card
                  key={user._id}
                  className={clsx(`hover:shadow-md transition-shadow border-4 rounded-xl`, rank === 1 && "bg-yellow-100", rank === 2 && "bg-gray-100", rank === 3 && "bg-orange-100")}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn("text-lg font-bold", {
                          "text-yellow-500": rank === 1,
                          "text-gray-400": rank === 2,
                          "text-orange-400": rank === 3,
                        })}
                      >
                        {rank === 1
                          ? "🥇"
                          : rank === 2
                          ? "🥈"
                          : rank === 3
                          ? "🥉"
                          : `#${rank}`}
                      </span>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.total_score} points
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  isActive={page === idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className="cursor-pointer"
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </div>
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

export default LeaderboardPage;
