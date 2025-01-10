import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: "Filename and body are required" },
      { status: 400 }
    );
  }

  // check if the image already exists
  const { blobs } = await list();
  const existingBlob = blobs.find((blob) => blob.pathname === filename);

  if (existingBlob) {
    return NextResponse.json({ url: existingBlob.url });
  }

  const blob = await put(filename, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
