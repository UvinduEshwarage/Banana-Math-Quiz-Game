import { NextResponse } from "next/server";

export async function GET(){

    const res = await fetch(
        "http://marcconrad.com/uob/banana/api.php?out=json"
    )
    const data = await res.json();
    return NextResponse.json(data,{status:200});
}