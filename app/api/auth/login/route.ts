import { signToken } from "@/lib/jwt";
import User  from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        await connectDB();

        const {email,password} = await req.json();

        if(!email || !password){
            return NextResponse.json({message:"Email and Password are required"},
                {status:400});
        }

        const user  = await User.findOne({email});
        if(!user){
            return NextResponse.json({message:"Invalid Credentials"},{status:401});
        }

        if(user.authProvider === 'google'){
            return NextResponse.json({message:"Please use Google login for this account."},{status:401});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return NextResponse.json({message:"Invalid Credentials"},{status:401});
        }
        const token = signToken({
            userId: user._id,
            email: user.email,
            name:user.name
        });

        const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    //store token in httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
    } catch (err:any) {
        return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
    }
}