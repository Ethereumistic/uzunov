import { Hero } from "#/components/layout/Hero";
import { FeaturedProjects } from "#/components/sections/FeaturedProjects";
import { createFileRoute } from "@tanstack/react-router";
import AboutSection from "#/components/sections/AboutSection";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="flex flex-col items-center justify-center p-5">
      <Hero />
      <FeaturedProjects />
      <AboutSection />
    </main>
  );
}
