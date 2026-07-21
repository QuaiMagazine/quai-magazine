import { Suspense } from "react";
import AboutSection from "@/components/AboutSection";

export default function AboutPage() {
  return (
    <Suspense>
      <AboutSection />
    </Suspense>
  );
}
