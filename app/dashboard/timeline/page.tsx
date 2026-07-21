import DashboardManager from "@/components/DashboardManager";
import { seedTimelineEvents } from "@/lib/cms-content";

export default function TimelineDashboardPage() {
  return <DashboardManager
    title="Timeline Manager"
    collection="timelineEvents"
    seedItems={seedTimelineEvents}
    newItem={{ category: "Quai", accent: "#FF6B00" }}
    nextOrderKey="order"
    fields={[
      { key: "id", label: "Event ID", required: true, placeholder: "e.g. quai-mainnet-2026", section: "TIMELINE EVENT" },
      { key: "order", label: "Chronological Order", required: true, placeholder: "e.g. 10", helpText: "Lower numbers appear first on the public timeline." },
      { key: "year", label: "Year", required: true, placeholder: "e.g. 2026" },
      { key: "title", label: "Event Title", required: true },
      { key: "category", label: "Category", required: true, placeholder: "e.g. Quai, Upgrade, Ecosystem", section: "DISPLAY" },
      { key: "accent", label: "Route Accent", type: "color", required: true },
      { key: "short", label: "Route Summary", type: "textarea", required: true, placeholder: "Short copy shown on the public timeline card." },
      { key: "description", label: "Full Event Story", type: "textarea", required: true, placeholder: "Full detail revealed when the public event is opened." },
      { key: "imageUrl", label: "Event Image", type: "file", section: "EVENT MEDIA", helpText: "Upload an image for this event card and detail view." },
      { key: "linkUrl", label: "Source URL", type: "url", placeholder: "https://...", helpText: "Optional. Adds a source button to the public event detail." },
    ]}
  />;
}
