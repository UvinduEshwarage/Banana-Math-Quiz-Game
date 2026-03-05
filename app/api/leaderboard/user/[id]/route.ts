import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GameScore from "@/lib/models/GameScore";
import mongoose from "mongoose";
import User from "@/lib/models/User";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    // unwrap the params promise
    const { id } = await context.params;

    // cast id to ObjectId
    const userId = new mongoose.Types.ObjectId(id);

    const games = await GameScore.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name")
      .select("score level createdAt");

    const formattedGames = games.map((game) => ({
      name: game.userId?.name || "Unknown",
      score: game.score,
      level: game.level,
      playedAt: game.createdAt,
    }));

    return NextResponse.json(formattedGames);
  } catch (error) {
    console.error("Error fetching user games:", error);
    return NextResponse.json(
      { error: "Failed to fetch user games" },
      { status: 500 }
    );
  }
}