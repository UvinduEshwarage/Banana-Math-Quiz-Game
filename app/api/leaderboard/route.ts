// app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import GameScore from "@/lib/models/GameScore";


export async function GET() {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Fetch top 10 scores, populate user name
    const leaderboard = await GameScore.find({ status: "finished" })
      .sort({ score: -1 })
      .limit(10)
      .populate<{ userId: { name: string } }>("userId", "name") // TS-friendly
      .select("score level userId"); // only pick needed fields

    // 3️⃣ Transform to clean JSON output
    const formattedLeaderboard = leaderboard.map(item => ({
      name: item.userId?.name || "Unknown Player",
      score: item.score,
      level: item.level,
    }));

    // 4️⃣ Return as JSON
    return NextResponse.json(formattedLeaderboard);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}