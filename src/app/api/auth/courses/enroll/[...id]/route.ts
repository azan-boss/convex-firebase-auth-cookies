import { NextRequest, NextResponse } from "next/server";

export  async function POST(request:NextRequest,{params}:{params:{id:string[]}}) {
    const {id}=await params
    console.log(id[0]);
    return NextResponse.json("this is data ")
    
}