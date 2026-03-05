import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import GameScore from "@/lib/models/GameScore"

export async function GET(
 req:Request,
 {params}:{params:{id:string}}
){

 await connectDB()

 const games = await GameScore
  .find({userId:params.id})
  .sort({createdAt:-1})

 return NextResponse.json(games)
 
}