import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import GameScore from "@/lib/models/GameScore"

export async function POST(req:Request){

 await connectDB()

 const {sessionId} = await req.json()

 const game = await GameScore.findById(sessionId)

 return NextResponse.json({
  finalScore:game.score,
  questionsAnswered:game.questionsAnswered
 })

}