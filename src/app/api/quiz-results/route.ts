import algoliasearch from "algoliasearch";
import { NextResponse } from "next/server";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_WRITE_API_KEY as string
);

const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await index.saveObject({
      objectID: crypto.randomUUID(),
      ...body,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed saving results" },
      { status: 500 }
    );
  }
}
