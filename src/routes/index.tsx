import { Hero } from "#/components/layout/Hero";
import { FeaturedProjects } from "#/components/sections/FeaturedProjects";
import { createFileRoute } from "@tanstack/react-router";
import AboutSection from "#/components/sections/AboutSection";
import { ServicesSection } from "#/components/sections/ServicesSection";
import { NumbersSection } from "#/components/sections/NumbersSection";
import { ContactSection } from "#/components/sections/ContactSection";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="flex flex-col items-center justify-center p-5">
      <Hero />
      <FeaturedProjects />
      <AboutSection />
      <NumbersSection />
      <ServicesSection />
      <ContactSection />
    </main>
  );
}
