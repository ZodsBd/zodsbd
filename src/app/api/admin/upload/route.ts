import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

const MAX = 4.5 * 1024 * 1024; // Vercel serverless body limit
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not configured" }, { status: 500 });
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  const folder = String(form.get("folder") || "products").replace(/[^a-z0-9-]/gi, "");
  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });
  const urls: string[] = [];
  for (const f of files) {
    if (!TYPES.includes(f.type)) return NextResponse.json({ error: `${f.name}: unsupported type` }, { status: 400 });
    if (f.size > MAX) return NextResponse.json({ error: `${f.name}: max 4.5MB` }, { status: 400 });
    const safe = f.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const blob = await put(`${folder}/${safe}`, f, { access: "public", addRandomSuffix: true, contentType: f.type });
    urls.push(blob.url);
  }
  return NextResponse.json({ urls });
}
