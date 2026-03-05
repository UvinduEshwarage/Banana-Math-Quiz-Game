// /app/api/game/start/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import GameScore from "@/lib/models/GameScore";

export async function POST() {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check for existing active game
    let game = await GameScore.findOne({
      userId: user.userId,
      status: "active",
    });

    if (!game) {
      game = await GameScore.create({
        userId: user.userId,
      });
    }

    return NextResponse.json({
      message: "Game started",
      gameId: game._id,
      score: game.score,
      questionsAnswered: game.questionsAnswered,
      level: game.level,
      status: game.status,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err }, { status: 500 });
  }
}