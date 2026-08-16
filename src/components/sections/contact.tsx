import { Github, Linkedin, Instagram, Mail, Phone, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader, SectionShell, Chip } from "@/components/ui";
import { HANDLES, SECTION_META, type HandleKey } from "@/constants";
import { AVAILABILITY } from "@content/config";

/**
 * Contact — calm and inviting (not a "terminal"). An open door for a student
 * building in public. Real channels link out; unset ones read "soon" (honest,
 * never a dead link). Availability states direction, not achievement.
 */
const CHANNELS: { key: HandleKey; icon: LucideIcon; external: boolean }[] = [
  { key: "github", icon: Github, external: true },
  { key: "linkedin", icon: Linkedin, external: true },
  { key: "instagram", icon: Instagram, external: true },
  { key: "email", icon: Mail, external: false },
  { key: "phone", icon: Phone, external: false },
];

export function Contact() {
  return (
    <SectionShell id="contact" label="Get in touch">
      <div className="grid gap-12 md:grid-cols-2">
        <SectionHeader
          as="h2"
          eyebrow={SECTION_META.contact.eyebrow}
          title={SECTION_META.contact.title}
          lede="I'm a computer-science student exploring AI and building in public. If you're working on something interesting — or just want to compare notes — say hello."
        />

        <div className="flex flex-col gap-10">
          <div>
            <p className="accession mb-4">Open to</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY.map((a) => (
                <Chip key={a}>{a}</Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="accession mb-1">Channels</p>
            <ul>
              {CHANNELS.map(({ key, icon: Icon, external }) => {
                const handle = HANDLES[key];
                const live = handle.href !== "#";
                return (
                  <li key={key} className="border-t border-[var(--border)]">
                    {live ? (
                      <a
                        href={handle.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="group flex items-center justify-between py-3.5 text-[var(--text)] transition-colors hover:text-[var(--accent)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="size-4 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]" />
                          {handle.label}
                        </span>
                        <ArrowUpRight className="size-4 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]" />
                      </a>
                    ) : (
                      <span className="flex items-center justify-between py-3.5 text-[var(--text-dim)]">
                        <span className="flex items-center gap-3">
                          <Icon className="size-4" />
                          {handle.label}
                        </span>
                        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
                          soon
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
