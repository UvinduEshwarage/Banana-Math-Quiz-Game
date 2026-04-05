import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GameScore from "@/lib/models/GameScore";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();

    const leaderboard = await GameScore.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "name") // populate user's name
      .select("score level userId");

    // Safe transformation to avoid null userId
    const formattedLeaderboard = leaderboard.map(item => ({
      name: item.userId?.name || "Unknown Player", // <-- key fix
      score: item.score,
      level: item.level
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}