import { BRAND } from "./constants";
import { siteUrl } from "./utils";

export function organizationLd(s: { contactPhone: string | null; contactEmail: string | null; facebookUrl: string | null; instagramUrl: string | null; tiktokUrl: string | null; youtubeUrl: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: siteUrl(),
    logo: siteUrl("/icon.svg"),
    description: BRAND.description,
    sameAs: [s.facebookUrl, s.instagramUrl, s.tiktokUrl, s.youtubeUrl].filter(Boolean),
    contactPoint: s.contactPhone ? [{ "@type": "ContactPoint", telephone: s.contactPhone, email: s.contactEmail ?? undefined, contactType: "customer service", areaServed: "BD" }] : undefined,
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: siteUrl(it.path) })),
  };
}
