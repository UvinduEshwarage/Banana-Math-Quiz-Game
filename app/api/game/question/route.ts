import { getAuthUser } from "@/lib/auth";
import GameScore from "@/lib/models/GameScore";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// /api/game/question
export async function GET() {
  await connectDB();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const game = await GameScore.findOne({
    userId: user.userId,
    status: "active",
  });

  if (!game) {
    return NextResponse.json(
      { message: "Start a game first" },
      { status: 400 }
    );
  }

  const res = await fetch(
    "http://marcconrad.com/uob/banana/api.php?out=json"
  );

  const data = await res.json();

  // IMPORTANT: save question in DB
  game.currentQuestion = data;
  await game.save();

  return NextResponse.json({
    gameId: game._id,
    score: game.score,
    level: game.level,
    questionsAnswered: game.questionsAnswered,
    question: data,
  });
}