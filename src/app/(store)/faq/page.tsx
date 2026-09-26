import type { Metadata } from "next";
import { PageHeader } from "@/components/brand/section-heading";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQS } from "@/lib/content";

export const metadata: Metadata = { title: "FAQ", description: "Answers about delivery, Cash on Delivery, exchanges and sizing at Zod's Bd.", alternates: { canonical: "/faq" } };

export default function FaqPage() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <JsonLd data={ld} />
      <PageHeader eyebrow="Help" title="Frequently Asked Questions" />
      <div className="container max-w-3xl py-14">
        <Accordion type="single" collapsible>
          {FAQS.map((f, i) => <AccordionItem key={i} value={`f${i}`} title={f.q}>{f.a}</AccordionItem>)}
        </Accordion>
      </div>
    </>
  );
}
