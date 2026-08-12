import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema=z.object({name:z.string().min(1).max(40),stack:z.string().min(1).max(70),title:z.string().min(1).max(60),category:z.string().min(1).max(20),builderId:z.string().regex(/^HH26-[A-Z0-9]{5}$/),imageDataUrl:z.string().startsWith("data:image/png;base64,")});
export async function POST(request:Request){
 try{
  const data=payloadSchema.parse(await request.json());
  if(!process.env.CLOUDINARY_CLOUD_NAME||!process.env.CLOUDINARY_API_KEY||!process.env.CLOUDINARY_API_SECRET) return NextResponse.json({error:"Share hosting is not configured. Download the card and attach it to your X post."},{status:503});
  cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});
  const result=await cloudinary.uploader.upload(data.imageDataUrl,{folder:"frame-goa-2026",public_id:data.builderId,overwrite:true,resource_type:"image",context:{name:data.name,stack:data.stack,title:data.title,category:data.category,builderId:data.builderId}});
  const base=process.env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin;
  return NextResponse.json({shareUrl:`${base}/share/${encodeURIComponent(data.builderId)}`,imageUrl:result.secure_url});
 }catch(error){console.error(error);return NextResponse.json({error:"We couldn’t prepare the share page. Please download the PNG and share it manually."},{status:500});}
}
