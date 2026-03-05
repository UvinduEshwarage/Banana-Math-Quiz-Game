import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import GameScore from "@/lib/models/GameScore"

export async function GET(){

 await connectDB()

 const leaderboard = await GameScore
  .find()
  .sort({score:-1})
  .limit(10)
  .populate("userId","name","score")

 return NextResponse.json(leaderboard)

}