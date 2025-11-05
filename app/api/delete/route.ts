import { del } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
  try {
    const res = await request.json();
    if (!res.url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Delete from Vercel Blob
    await del(res.url);

    // Update database urls columns to null
    if (res.loaneeType === "member") {
      if (res.docType === "idCardFront") {
        await sql`UPDATE members SET id_front=${null} WHERE id=${res.memberId}`;
      }

      if (res.docType === "idCardBack") {
        await sql`UPDATE members SET id_back=${null} WHERE id=${res.memberId}`;
      }

      if (res.docType === "passport") {
        await sql`UPDATE members SET passport=${null} WHERE id=${res.memberId}`;
      }

      if (res.docType === "applicationForm") {
        await sql`UPDATE members SET doc=${null} WHERE id=${res.memberId}`;
      }
    }

    if (res.loaneeType === "individual") {
      if (res.docType === "idCardFront") {
        await sql`UPDATE individuals SET id_front=${null} WHERE id=${
          res.memberId
        }`;
      }

      if (res.docType === "idCardBack") {
        await sql`UPDATE individuals SET id_back=${null} WHERE id=${
          res.memberId
        }`;
      }

      if (res.docType === "passport") {
        await sql`UPDATE individuals SET passport=${null} WHERE id=${
          res.memberId
        }`;
      }

      if (res.docType === "applicationForm") {
        await sql`UPDATE individuals SET doc=${null} WHERE id=${res.memberId}`;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
