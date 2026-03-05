import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GameScore from "@/lib/models/GameScore";
import  User  from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();

    const leaderboard = await GameScore.find()
      .sort({ score: -1 })       // sort by score descending
      .limit(10)                 // top 10
      .populate("userId", "name") // fetch only the user's name
      .select("score level userId"); // explicitly select fields from GameScore

    // Transform to return cleaner JSON
    const formattedLeaderboard = leaderboard.map(item => ({
      name: item.userId.name,
      score: item.score,
      level: item.level
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}