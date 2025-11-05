import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const memberId = formData.get("memberId") as string;
    const documentType = formData.get("documentType") as string;
    const groupId = formData.get("groupId") as string;
    const loanee = formData.get("loanee") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a unique filename with meber ID and timestamp
    const timestamp = Date.now();
    const filename = `members/${memberId}/${documentType}/${timestamp}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    if (loanee === "member") {
      if (documentType === "idCardFront") {
        await sql`UPDATE members SET id_front=${blob.url} WHERE id=${memberId}`;
      }

      if (documentType === "idCardBack") {
        await sql`UPDATE members SET id_back=${blob.url} WHERE id=${memberId}`;
      }

      if (documentType === "passport") {
        await sql`UPDATE members SET passport=${blob.url} WHERE id=${memberId}`;
      }

      if (documentType === "applicationForm") {
        await sql`UPDATE members SET doc=${blob.url} WHERE id=${memberId}`;
      }
    }

    if (loanee === "individual") {
      if (documentType === "idCardFront") {
        await sql`UPDATE individuals SET id_front=${blob.url} WHERE id=${memberId}`;
      }

      if (documentType === "idCardBack") {
        await sql`UPDATE individuals SET id_back=${blob.url} WHERE id=${memberId}`;
      }

      if (documentType === "passport") {
        await sql`UPDATE individuals SET passport=${blob.url} WHERE id=${memberId}`;
      }

      if (documentType === "applicationForm") {
        await sql`UPDATE individuals SET doc=${blob.url} WHERE id=${memberId}`;
      }
    }

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
