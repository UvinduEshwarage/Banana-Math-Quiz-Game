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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a2e,#0f0f1a,#000)]">
      
      <div className="relative w-full max-w-lg bg-[#111827]/90 backdrop-blur-xl border-4 border-yellow-400 rounded-3xl shadow-[0_0_60px_rgba(255,255,0,0.25)] p-8 text-yellow-100">
        
        {/* Glow border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-yellow-300 opacity-20 animate-pulse pointer-events-none"></div>

        <h1 className="text-3xl font-extrabold text-center mb-6 text-yellow-300 drop-shadow-[2px_2px_0px_#000]">
          🏆 Leaderboard
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-yellow-300 animate-pulse">Loading...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="space-y-3">
            {data.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-black/40 border-2 border-yellow-400 rounded-xl px-4 py-3 shadow-[0_4px_0_#b45309]"
              >
                {/* Rank */}
                <div className="font-bold w-10 text-lg">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `#${index + 1}`}
                </div>

                {/* Name */}
                <div className="flex-1 text-left font-semibold">
                  {user.name}
                </div>

                {/* Level */}
                <div className="w-16 text-center text-sm text-yellow-300">
                  Lv {user.level}
                </div>

                {/* Score */}
                <div className="font-bold w-16 text-right text-yellow-200">
                  {user.score}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <p className="text-center text-yellow-400">
            No scores yet
          </p>
        )}
      </div>
    </div>
  );
}