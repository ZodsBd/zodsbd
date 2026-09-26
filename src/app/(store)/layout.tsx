import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { StoreProvider } from "@/components/store-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import { getSettings, ratesFrom } from "@/lib/settings";
import { organizationLd } from "@/lib/seo";

export const revalidate = 300;

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }),
  ]);
  return (
    <StoreProvider rates={ratesFrom(settings)}>
      <JsonLd data={organizationLd(settings)} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <Header categories={categories} />
      <main id="main" className="min-h-[60vh] pb-16 lg:pb-0">{children}</main>
      <Footer categories={categories} settings={settings} />
      <CartDrawer />
      <WhatsAppFab number={settings.whatsappNumber} />
      <MobileNav />
    </StoreProvider>
  );
}
