import DashboardManager from "@/components/DashboardManager";
import { seedSiteSettings } from "@/lib/cms-content";

export default function DashboardSettingsPage() {
  return (
    <DashboardManager
      title="Site Settings"
      collection="siteSettings"
      seedItems={seedSiteSettings}
      singleton
      fields={[
        {
          key: "showViewCounts",
          label: "Show and record public view counts",
          type: "checkbox",
          helpText: "When off, article, media, post, and AMA archive view counts are hidden and no longer incremented.",
          section: "PUBLIC CONTENT",
        },
      ]}
    />
  );
}
