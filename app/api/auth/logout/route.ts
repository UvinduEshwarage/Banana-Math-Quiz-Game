import { NextResponse } from "next/server";
import path from "path";

export async function POST(){
    const  response = NextResponse.json({
        message:"Logged Out"
    },{status:200});

    response.cookies.set("token","",{
        httpOnly:true,
        maxAge:0,
        expires:new Date(0),
        path:"/",
    });
    return response;
}