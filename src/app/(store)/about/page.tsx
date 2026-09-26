import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/brand/section-heading";
import { Reveal } from "@/components/brand/reveal";
import { TrustBadges } from "@/components/home/trust-badges";
import { STORY_IMAGE } from "@/lib/home-images";

export const metadata: Metadata = { title: "About Us", description: "The story behind Zod's Bd — premium lifestyle accessories for Bangladesh.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Our Story" title="About Zod's Bd" intro="A small Dhaka studio with an uncompromising eye for materials, proportion and finish." />
      <section className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-ivory"><Image src={STORY_IMAGE} alt="Leather craftsmanship" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" /></Reveal>
        <Reveal delay={0.1} className="prose-luxe">
          <h2>Considered, not conspicuous</h2>
          <p>We started Zod&apos;s Bd because we couldn&apos;t find accessories in Bangladesh that balanced honest materials with refined design — without the imported price tag.</p>
          <p>Every belt, backpack, case, clutch and fragrance is selected or developed by our team, inspected by hand, and packed in our signature box. We work with trusted workshops and suppliers, and we stand behind everything we sell with a 7-day exchange.</p>
          <blockquote>Luxury is the quiet confidence of something made well.</blockquote>
          <p>Thank you for carrying Zod&apos;s.</p>
        </Reveal>
      </section>
      <section className="container pb-20"><TrustBadges /></section>
    </>
  );
}
