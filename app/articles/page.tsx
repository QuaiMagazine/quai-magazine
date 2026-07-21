import { Suspense } from "react";
import ArticlesSection from "@/components/ArticlesSection";

export default function ArticlesPage() {
  return (
    <Suspense>
      <ArticlesSection />
    </Suspense>
  );
}
