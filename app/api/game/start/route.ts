import GameScore from "@/lib/models/GameScore";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    await connectDB();

    const {userId} = await req.json();
    if(!userId){
        return NextResponse.json({message:"User ID is required!"},{status:400});
    }

    const game = await GameScore.create({
        userId,
        score:0,
        questionsAnswered:0,
        level:1
    })

    return NextResponse.json(game,{status:201});
}