import { Suspense } from "react";
import MediaSection from "@/components/MediaSection";

export default function MediaPage() {
  return (
    <Suspense>
      <MediaSection />
    </Suspense>
  );
}
