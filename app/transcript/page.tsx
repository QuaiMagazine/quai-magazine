import { Suspense } from "react";
import TranscriptSection from "@/components/TranscriptSection";

export default function TranscriptPage() {
  return (
    <Suspense>
      <TranscriptSection />
    </Suspense>
  );
}
