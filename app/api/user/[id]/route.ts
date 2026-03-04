import { User } from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req:Request,
    context:{params:{id:string}}){
    try {
        await connectDB();
        
        const {id} = await context.params;

        if(!id){
            return NextResponse.json({message:"User ID is required!"},{status:400});
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            return NextResponse.json({message:"Invalid User ID!"},{status:400});
        }

        const user = await User.findById(id);
        
        if(!user){
            return NextResponse.json({message:"No user Found!"},{status:404});
        }
        
        return NextResponse.json({user},{status:200});

    } catch (err:any) {
        return NextResponse.json(
            {message:"Internal Server Error!"},
            {status:500}
        )
    }
}