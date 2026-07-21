import { Suspense } from "react";
import TranscriptSessionView from "@/components/TranscriptSessionView";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <TranscriptSessionView id={id} />
    </Suspense>
  );
}
