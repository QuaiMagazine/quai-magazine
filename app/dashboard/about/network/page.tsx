import DashboardManager from "@/components/DashboardManager";
import { seedNetworkStats } from "@/lib/cms-content";

export default function NetworkStatsDashboardPage() {
  return (
    <DashboardManager
      title="Network Stats Dashboard"
      collection="networkStats"
      seedItems={seedNetworkStats}
      fields={[
        { key: "id", label: "Stat ID", required: true, section: "NETWORK STAT" },
        { key: "icon", label: "Icon", type: "select", options: ["⚡", "⛓", "◈", "◉", "◎", "◆"], required: true },
        { key: "label", label: "Label", required: true },
        { key: "value", label: "Value", required: true },
        { key: "desc", label: "Description", type: "textarea", required: true },
      ]}
    />
  );
}
