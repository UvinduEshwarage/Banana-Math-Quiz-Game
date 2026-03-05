import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import GameScore from "@/lib/models/GameScore";

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { gameId } = await req.json();
    const game = await GameScore.findById(gameId);

    if (!game || game.userId.toString() !== user.userId || game.status !== "active") {
      return NextResponse.json({ message: "Invalid game session", status: 400 });
    }

    game.status = "finished";
    game.endedAt = new Date();
    await game.save();

    return NextResponse.json({
      message: "Game finished",
      finalScore: game.score,
      level: game.level,
      questionsAnswered: game.questionsAnswered,
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err }, { status: 500 });
  }
}