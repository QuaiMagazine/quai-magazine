import { NextResponse } from "next/server";
import { ensureSeeded, getCmsCollection } from "@/lib/mongodb";
import type { CmsCollectionName } from "@/lib/cms-content";

const viewCollections = ["articles", "aboutArticles", "media", "amaSessions"] as const;
type ViewCollection = typeof viewCollections[number];

function isViewCollection(value: string): value is ViewCollection {
  return viewCollections.includes(value as ViewCollection);
}

export async function POST(request: Request) {
  try {
    const { collection, id } = await request.json() as { collection?: string; id?: string };
    if (!collection || !id || !isViewCollection(collection)) return NextResponse.json({ error: "Unknown content." }, { status: 400 });

    await ensureSeeded("siteSettings");
    const settings = await (await getCmsCollection("siteSettings")).findOne({ id: "site-settings" }) as { showViewCounts?: boolean } | null;
    if (settings?.showViewCounts === false) return NextResponse.json({ enabled: false });

    await ensureSeeded(collection as CmsCollectionName);
    const result = await (await getCmsCollection(collection)).findOneAndUpdate(
      { id },
      { $inc: { viewCount: 1 }, $set: { updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    const viewCount = Number((result as { viewCount?: number } | null)?.viewCount || 0);
    return NextResponse.json({ enabled: true, viewCount });
  } catch (error) {
    console.error("View count failed", error);
    return NextResponse.json({ error: "Unable to record view." }, { status: 500 });
  }
}
