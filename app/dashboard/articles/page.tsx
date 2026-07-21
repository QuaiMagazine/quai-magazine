import DashboardManager from "@/components/DashboardManager";
import { seedArticles } from "@/lib/cms-content";

export default function ArticleDashboardPage() {
  return <DashboardManager
    title="Article Library"
    collection="articles"
    seedItems={seedArticles}
    filterKey="type"
    filterOptions={["internal", "external"]}
    newItem={{ type: "internal", featured: false }}
    fields={[
      { key: "id", label: "Article ID", required: true, placeholder: "e.g. protocol-update-july", section: "CONTENT" },
      { key: "type", label: "Article Type", type: "select", options: ["internal", "external"], required: true },
      { key: "title", label: "Title", required: true },
      { key: "excerpt", label: "Card Excerpt", type: "textarea", placeholder: "Optional shorter text for the public card" },
      { key: "body", label: "Full Article", type: "textarea", required: true, placeholder: "Public article detail content" },
      { key: "date", label: "Publish Date", required: true, placeholder: "e.g. Jul 18, 2026", section: "PUBLISHING" },
      { key: "category", label: "Category", required: true },
      { key: "read", label: "Read Time", required: true, placeholder: "e.g. 5 min" },
      { key: "featured", label: "Featured", type: "checkbox" },
      { key: "coverImageUrl", label: "Cover Image", type: "file", section: "MEDIA", helpText: "Upload an image. The public article card uses it immediately after saving." },
      { key: "source", label: "Source Name", required: true, visibleWhen: { key: "type", value: "external" }, section: "EXTERNAL SOURCE" },
      { key: "externalUrl", label: "Source URL", type: "url", required: true, visibleWhen: { key: "type", value: "external" }, helpText: "Used by the public external article button." },
    ]}
  />;
}
