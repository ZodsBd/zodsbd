import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/brand/section-heading";
import { ContactForm } from "@/components/contact-form";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Contact Us", description: "Get in touch with Zod's Bd — we reply within 24 hours.", alternates: { canonical: "/contact" } };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader eyebrow="Client Care" title="Contact Us" intro="Questions about sizing, an order or a gift? We're here, 10am – 9pm, every day." />
      <div className="container grid gap-14 py-16 lg:grid-cols-[1fr_360px]">
        <ContactForm />
        <aside className="space-y-6 bg-ivory p-8 text-sm">
          {s.contactPhone && <p className="flex gap-3"><Phone className="h-4 w-4 text-gold" /><a href={`tel:${s.contactPhone}`}>{s.contactPhone}</a></p>}
          <p className="flex gap-3"><MessageCircle className="h-4 w-4 text-gold" /><a href={`https://wa.me/${s.whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp us</a></p>
          {s.contactEmail && <p className="flex gap-3"><Mail className="h-4 w-4 text-gold" /><a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a></p>}
          {s.address && <p className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-gold" />{s.address}</p>}
        </aside>
      </div>
    </>
  );
}
