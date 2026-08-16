import { Hero } from "@/components/sections/hero";
import { ProjectExperience } from "@/components/sections/project-experience";
import { IdentityAnchor } from "@/components/system/identity-anchor";

/**
 * Portfolio v2 ("In Focus") — Main Spatial Workspace.
 * 2-Column Split Architecture:
 * - Left: Persistent sticky identity anchor
 * - Right: Continuous scrolling stream of real work (Hero -> CampusSwap AI)
 * @see docs/02-identity-first.md
 * @see docs/03-interaction-philosophy.md
 */
export default function HomePage() {
  return (
    <div className="relative min-h-screen z-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Left Column: Persistent Sticky Identity Anchor */}
        <IdentityAnchor />

        {/* Right Column: Continuous Scrolling Work Stream */}
        <main className="flex-1 min-w-0 w-full space-y-12">
          <Hero />
          <ProjectExperience />
        </main>
      </div>
    </div>
  );
}
