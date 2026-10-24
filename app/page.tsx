import { site } from "@/content/site";
import { Hero } from "@/components/hero";
import {
  AboutSection,
  ContactSection,
  ProcessSection,
  ServicesSection,
  ShowreelSection,
  SkillsMarquee,
  WorkSection,
} from "@/components/sections";
import { JsonLd } from "@/components/json-ld";

export default function Home() {
  const sameAs = [site.social.linkedin, site.social.instagram, site.social.x, site.social.vimeo, site.social.youtube].filter(
    Boolean,
  );
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${site.url}/#person`,
            name: site.name,
            jobTitle: site.jobTitle,
            url: site.url,
            email: `mailto:${site.social.email}`,
            ...(site.social.phone ? { telephone: `+${site.social.phone}` } : {}),
            sameAs,
            knowsAbout: [...site.about.strengths],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: `${site.name} — Portfolio`,
            url: site.url,
            author: { "@id": `${site.url}/#person` },
          },
        ]}
      />
      <Hero />
      <ShowreelSection />
      <SkillsMarquee />
      <WorkSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
