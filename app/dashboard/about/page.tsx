import DashboardManager from "@/components/DashboardManager";
import { seedAboutArticles } from "@/lib/cms-content";

export default function AboutDashboardPage() {
  return <DashboardManager
    title="Quai Magazine"
    collection="aboutArticles"
    seedItems={seedAboutArticles}
    fields={[
      { key: "id", label: "Article ID", required: true, placeholder: "e.g. quai-architecture", section: "CONTENT" },
      { key: "title", label: "Title", required: true },
      { key: "excerpt", label: "Card Excerpt", type: "textarea", placeholder: "Optional shorter text for the public card" },
      { key: "body", label: "Full Article", type: "textarea", required: true },
      { key: "date", label: "Publish Date", required: true, placeholder: "e.g. Jul 18, 2026", section: "PUBLISHING" },
      { key: "category", label: "Category", required: true },
      { key: "read", label: "Read Time", required: true, placeholder: "e.g. 5 min" },
      { key: "coverImageUrl", label: "Cover Image", type: "file", section: "MEDIA", helpText: "Upload an image for the public magazine card." },
    ]}
  />;
}
