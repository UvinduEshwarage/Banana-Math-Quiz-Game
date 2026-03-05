import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import GameScore from "@/lib/models/GameScore"

export async function POST(req:Request){

 await connectDB()

 const {sessionId,answer,solution} = await req.json()

 const game = await GameScore.findById(sessionId)

 game.questionsAnswered += 1

 let correct = false

 if(Number(answer) === Number(solution)){

  game.score += 10
  correct = true

 }

 await game.save()

 return NextResponse.json({
  correct,
  score:game.score
 })

}