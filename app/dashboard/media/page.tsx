import DashboardManager from "@/components/DashboardManager";
import { seedMediaItems } from "@/lib/cms-content";

const audioOnly = { key: "type", value: "audio" };
const videoOnly = { key: "type", value: "video" };
const externalOnly = { key: "type", value: "external" };

export default function MediaDashboardPage() {
  return (
    <DashboardManager
      title="Media Library"
      collection="media"
      seedItems={seedMediaItems}
      filterKey="type"
      filterOptions={["audio", "video", "external"]}
      newItem={{ type: "audio", rssUrl: "https://www.qu.ai/blog", spotifyUrl: "https://open.spotify.com/" }}
      fields={[
        { key: "id", label: "Content ID", required: true, placeholder: "e.g. audio-ama-july-2026", section: "CONTENT" },
        { key: "type", label: "Media Type", type: "select", options: ["audio", "video", "external"], required: true },
        { key: "title", label: "Title", required: true, placeholder: "Shown as the card title" },
        { key: "description", label: "Description", type: "textarea", required: true, placeholder: "Shown on the public media card" },

        { key: "episode", label: "Episode Label", required: true, placeholder: "e.g. EP. 07", visibleWhen: audioOnly, section: "AUDIO EPISODE" },
        { key: "publishedAt", label: "Publish Date", required: true, placeholder: "e.g. Jul 18, 2026", visibleWhen: { key: "type", value: ["audio", "video"] } },
        { key: "duration", label: "Duration", required: true, placeholder: "e.g. 48:12", visibleWhen: audioOnly },
        { key: "audioUrl", label: "Audio File", type: "file", accept: "audio/*", visibleWhen: audioOnly, helpText: "Upload the audio used by the public Listen button." },
        { key: "rssUrl", label: "RSS URL", type: "url", placeholder: "https://...", visibleWhen: audioOnly },
        { key: "spotifyUrl", label: "Spotify URL", type: "url", placeholder: "https://...", visibleWhen: audioOnly },

        { key: "duration", label: "Duration", required: true, placeholder: "e.g. 34:45", visibleWhen: videoOnly, section: "VIDEO DETAILS" },
        { key: "views", label: "View Count", placeholder: "e.g. 12.4K", visibleWhen: videoOnly },
        { key: "watchUrl", label: "Video File", type: "file", accept: "video/*", visibleWhen: videoOnly, helpText: "Upload the video used by the public Watch button." },

        { key: "platform", label: "Platform Name", required: true, placeholder: "e.g. YouTube", visibleWhen: externalOnly, section: "EXTERNAL PLATFORM" },
        { key: "handle", label: "Handle / Label", required: true, placeholder: "e.g. @QuaiNetwork", visibleWhen: externalOnly },
        { key: "profileUrl", label: "Profile URL", type: "url", placeholder: "https://...", visibleWhen: externalOnly, helpText: "The public platform card opens this URL." },
        { key: "brandColor", label: "Brand Color", placeholder: "e.g. #FF0000", visibleWhen: externalOnly },

        { key: "thumbnailUrl", label: "Thumbnail Image", type: "file", section: "DISPLAY", helpText: "Upload the image used on the public media card." },
      ]}
    />
  );
}
