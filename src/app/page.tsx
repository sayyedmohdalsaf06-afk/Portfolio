import { Hero } from "@/components/sections/hero";
import { FloatingPhotoCard } from "@/components/sections/floating-photo-card";
import { IdentityTerminal } from "@/components/sections/identity-terminal";
import { ProjectExperience } from "@/components/sections/project-experience";
import { AnimeCharacter3D } from "@/components/sections/anime-character-3d";
import { TopNavigation } from "@/components/system/top-navigation";

/**
 * Portfolio v2 ("In Focus") — Main Spatial Workspace.
 *
 * Architecture:
 * - Opening: Cinematic Spatial Arrival (Fluid, Zero-Blocking, Kinetic Choreography)
 * - Top: Modern System Navigation (Status, Waypoints, Theme Toggle)
 * - Main 2-Column Split:
 *   - Left: 3D Floating Identity Photo Card (Tactile Builder Dossier)
 *   - Right: Stream of real work (Centered Big Name Hero -> Terminal -> CAMPLX)
 * - Persistent: Interactive 3D Guide Companion Bot following down across all scroll stops
 */
export default function HomePage() {
  return (
    <div className="relative min-h-screen z-1 flex flex-col">
      {/* Top Workspace System Navigation Bar (Slides down smoothly) */}
      <TopNavigation />

      {/* Main Split Content Area */}
      <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Left Column: 3D Floating Photo Card */}
          <FloatingPhotoCard />

          {/* Right Column: Centered Big Name Hero + Terminal + CAMPLX */}
          <main className="flex-1 min-w-0 w-full space-y-16">
            <Hero />
            <IdentityTerminal />
            <ProjectExperience />
          </main>
        </div>
      </div>

      {/* Interactive 3D Character Companion Bot (follows down dynamically across all stops) */}
      <AnimeCharacter3D />
    </div>
  );
}
