import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import GameScore from "@/lib/models/GameScore";

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { gameId, answer } = await req.json();

    if (!gameId || typeof answer !== "number") {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const game = await GameScore.findById(gameId);

    if (!game || game.userId.toString() !== user.userId || game.status !== "active") {
      return NextResponse.json({ message: "Invalid game session" }, { status: 400 });
    }

    if (!game.currentQuestion || game.currentQuestion.solution === undefined) {
      return NextResponse.json(
        { message: "No current question. Fetch a new one first." },
        { status: 400 }
      );
    }

    const correctAnswer = game.currentQuestion.solution;
    const correct = correctAnswer === answer;

    if (correct) {
      game.score += 10;
      game.correctAnswersInRow = (game.correctAnswersInRow || 0) + 1;

      if (game.correctAnswersInRow % 5 === 0) {
        game.level += 1;
      }
    } else {
      game.correctAnswersInRow = 0;
    }

    game.questionsAnswered += 1;

    game.currentQuestion = null;

    await game.save();

    return NextResponse.json({
      score: game.score,
      questionsAnswered: game.questionsAnswered,
      level: game.level,
      correct,
      correctAnswer,
    });

  } catch (err) {
    return NextResponse.json(
      {
        message: "Server error",
        error: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    );
  }
}