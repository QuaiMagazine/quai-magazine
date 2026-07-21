import { Suspense } from "react";
import ArticleDetailView from "@/components/ArticleDetailView";
import { findAboutArticle } from "@/lib/cms-queries";

export const dynamic = "force-dynamic";

export default async function AboutArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await findAboutArticle(id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--tx-mid)", fontFamily: "Inter, sans-serif" }}>Article not found.</p>
      </div>
    );
  }

  return (
    <Suspense>
      <ArticleDetailView
        article={article}
        backUrl="/about?tab=magazine"
        backLabel="BACK TO ABOUT"
        viewCollection="aboutArticles"
      />
    </Suspense>
  );
}
