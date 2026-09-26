import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/brand/social-icons";
import { Wordmark } from "@/components/brand/wordmark";
import { NewsletterForm } from "@/components/home/newsletter-form";
import type { NavCategory } from "./header";

type FooterSettings = {
  contactPhone: string | null; contactEmail: string | null; address: string | null;
  facebookUrl: string | null; instagramUrl: string | null; tiktokUrl: string | null; youtubeUrl: string | null;
};

export function Footer({ categories, settings }: { categories: NavCategory[]; settings: FooterSettings }) {
  const socials = [
    { href: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { href: settings.tiktokUrl, label: "TikTok", Icon: TiktokIcon },
    { href: settings.youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
  ].filter((s) => s.href);
  return (
    <footer className="bg-obsidian pb-24 pt-16 text-white/80 lg:pb-10">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Wordmark light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Considered accessories for the modern Bangladeshi wardrobe — crafted to be carried for years.
            </p>
            <div className="mt-6 max-w-sm"><NewsletterForm dark /></div>
          </div>
          <FooterCol title="Shop" links={[{ href: "/shop", label: "All Products" }, ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name }))]} />
          <FooterCol title="Help" links={[
            { href: "/track", label: "Track My Order" }, { href: "/faq", label: "FAQ" },
            { href: "/policies/shipping", label: "Shipping Policy" }, { href: "/policies/returns", label: "Return & Exchange" },
            { href: "/contact", label: "Contact Us" },
          ]} />
          <div>
            <h3 className="mb-5 text-[11px] uppercase tracking-luxe text-gold">Contact</h3>
            <ul className="space-y-3 text-sm">
              {settings.contactPhone && <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></li>}
              {settings.contactEmail && <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>}
              {settings.address && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><span>{settings.address}</span></li>}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}><a href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center border border-white/20 hover:border-gold hover:text-gold"><Icon className="h-4 w-4" /></a></li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Zod&apos;s Bd. All rights reserved.</p>
          <ul className="flex flex-wrap gap-5">
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-gold">Privacy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-gold">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-5 text-[11px] uppercase tracking-luxe text-gold">{title}</h3>
      <ul className="space-y-3 text-sm">
        {links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-gold">{l.label}</Link></li>)}
      </ul>
    </div>
  );
}
