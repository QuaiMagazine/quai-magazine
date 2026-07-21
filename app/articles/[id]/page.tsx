import { Suspense } from "react";
import ArticleDetailView from "@/components/ArticleDetailView";
import { findArticle } from "@/lib/cms-queries";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;

  const article = await findArticle(id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--tx-mid)", fontFamily: "Inter, sans-serif" }}>Article not found.</p>
      </div>
    );
  }

  const isExternal = article.type === "external";
  const backUrl = from === "external" || isExternal
    ? "/articles?tab=external"
    : "/articles?tab=internal";

  return (
    <Suspense>
      <ArticleDetailView
        article={article}
        backUrl={backUrl}
        backLabel="BACK TO ARTICLES"
        viewCollection="articles"
      />
    </Suspense>
  );
}
