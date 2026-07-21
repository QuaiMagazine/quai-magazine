import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_MEDIA_BYTES = 100 * 1024 * 1024;

function configured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!configured()) {
    return NextResponse.json({ error: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isAudio && !isVideo) return NextResponse.json({ error: "Only image, audio, and video files are allowed." }, { status: 400 });
  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_MEDIA_BYTES;
  if (file.size > maxBytes) return NextResponse.json({ error: isImage ? "Images must be 10 MB or smaller." : "Audio and video files must be 100 MB or smaller." }, { status: 400 });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "quai-cms",
          resource_type: "auto",
          ...(isImage ? { transformation: [{ quality: "auto", fetch_format: "auto" }] } : {}),
        },
        (error, upload) => error || !upload ? reject(error || new Error("Upload failed")) : resolve(upload),
      );
      stream.end(bytes);
    });
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
  }
}
