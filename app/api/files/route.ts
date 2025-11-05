import { list } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list();
    console.log(blobs);
    // `blobs` will be an array of objects, each containing details like `url`, `pathname`, `size`, `uploadedAt`
    return Response.json(blobs);
  } catch (error) {
    console.error("Error listing blobs:", error);
    return new Response("Error listing blobs", { status: 500 });
  }
}
