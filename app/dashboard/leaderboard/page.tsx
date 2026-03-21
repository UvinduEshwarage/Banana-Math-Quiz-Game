"use client";

import React, { useEffect, useState } from "react";

type LeaderboardUser = {
  name: string;
  score: number;
  level: number;
};

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");

        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-100 rounded-2xl shadow-xl text-black p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold  text-center mb-6">
          Leaderboard
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="space-y-3">
            {data.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm"
              >
                {/* Rank */}
                <div className="font-bold w-10">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `#${index + 1}`}
                </div>

                {/* Name */}
                <div className="flex-1 text-left">
                  {user.name}
                </div>

                {/* Level */}
                <div className="w-16 text-center text-sm text-gray-500">
                  Lv {user.level}
                </div>

                {/* Score */}
                <div className="font-semibold w-16 text-right">
                  {user.score}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <p className="text-center text-gray-400">
            No scores yet
          </p>
        )}
      </div>
    </div>
  );
}