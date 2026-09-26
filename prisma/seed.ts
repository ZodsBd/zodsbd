/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES } from "./seed-data/categories";
import { PRODUCTS, POOL, pick } from "./seed-data/products";
import { BANNERS, COUPONS, POSTS, REVIEWS } from "./seed-data/content";
import { SAMPLE_ORDERS } from "./seed-data/orders";
import { refreshProductAggregates } from "../src/lib/product-aggregates";
import { dhakaDayKey } from "../src/lib/order-number";
import { slugify, variantLabel } from "../src/lib/utils";

const prisma = new PrismaClient();

/**
 * Modes:
 *   npm run db:seed        → FRESH: 7 products (every category), 0 orders, 0 reviews, 0 customers
 *   npm run db:seed:demo   → DEMO: 35 products, reviews, 8 sample orders (for testing the dashboard)
 */
const FRESH = !process.argv.includes("--demo");
// Indexes into PRODUCTS used for the fresh store (edit to choose different starters).
const FRESH_PICK = [0, 7, 13, 14, 21, 23, 28];
const round50 = (n: number) => Math.round(n / 50) * 50;

async function main() {
  console.log("→ Clearing existing data…");
  await prisma.$transaction([
    prisma.orderNote.deleteMany(), prisma.orderEvent.deleteMany(), prisma.orderItem.deleteMany(), prisma.order.deleteMany(),
    prisma.orderSequence.deleteMany(), prisma.customer.deleteMany(), prisma.review.deleteMany(), prisma.productImage.deleteMany(),
    prisma.productVariant.deleteMany(), prisma.product.deleteMany(), prisma.category.deleteMany(), prisma.coupon.deleteMany(),
    prisma.banner.deleteMany(), prisma.post.deleteMany(), prisma.contactMessage.deleteMany(), prisma.newsletterSubscriber.deleteMany(),
  ]);

  // ── Admin ──
  const email = (process.env.ADMIN_EMAIL || "admin@zodsbd.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, name: process.env.ADMIN_NAME || "Zod's Admin", passwordHash: await bcrypt.hash(password, 10) },
    update: { passwordHash: await bcrypt.hash(password, 10), name: process.env.ADMIN_NAME || "Zod's Admin" },
  });
  console.log(`✓ Admin: ${email}`);

  // ── Settings ──
  await prisma.storeSettings.upsert({
    where: { id: "store" },
    create: { id: "store", contactPhone: "+880 1700-000000", contactEmail: "hello@zodsbd.com", address: "House 21, Road 11, Banani, Dhaka 1213", instagramUrl: "https://instagram.com/", facebookUrl: "https://facebook.com/" },
    update: {},
  });

  // ── Categories ──
  const catId: Record<string, string> = {};
  for (const c of CATEGORIES) catId[c.slug] = (await prisma.category.create({ data: c })).id;
  console.log(`✓ ${CATEGORIES.length} categories`);

  // ── Products + variants ──
  const labels: Record<string, { colorLabel: string | null; sizeLabel: string | null; sizeGuide: string | null }> = {
    backpacks: { colorLabel: "Colour", sizeLabel: "Capacity", sizeGuide: "backpack" },
    belts: { colorLabel: "Colour", sizeLabel: "Waist", sizeGuide: "belt" },
    "cigarette-cases": { colorLabel: "Finish", sizeLabel: "Capacity", sizeGuide: null },
    perfumes: { colorLabel: null, sizeLabel: "Volume", sizeGuide: null },
    "clutch-bags": { colorLabel: "Colour", sizeLabel: null, sizeGuide: null },
  };
  const productIds: string[] = [];
  const now = Date.now();
  const catalogue = FRESH ? FRESH_PICK.map((i) => PRODUCTS[i]) : PRODUCTS;
  for (const [idx, p] of catalogue.entries()) {
    const slug = slugify(p.name);
    const images = pick(POOL[p.category], idx, 3);
    const colors = p.colors?.length ? p.colors : [null];
    const sizes = p.sizes?.length ? p.sizes : [null];
    const skuBase = slug.split("-").map((w) => w[0]).join("").toUpperCase().slice(0, 5) + String(idx + 1).padStart(2, "0");
    const variants = colors.flatMap((c, ci) => sizes.map((s, si) => {
      const key = `${c ?? ""}/${s ?? ""}`;
      const price = round50(p.price + (p.step ?? 0) * si);
      const soldOut = p.soldOut?.includes(key);
      return {
        sku: [skuBase, c?.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase(), s?.replace(/[^A-Za-z0-9]/g, "").toUpperCase()].filter(Boolean).join("-"),
        color: c, size: s, price,
        compareAtPrice: p.sale ? round50(price * (1 + p.sale / 100)) : null,
        stock: soldOut ? 0 : ((idx * 7 + ci * 5 + si * 3) % 14) + (idx % 6 === 0 && si === 0 ? 1 : 3),
        imageUrl: c && colors.length > 1 ? images[ci % images.length] : null,
        sortOrder: ci * sizes.length + si,
      };
    }));
    const created = await prisma.product.create({
      data: {
        name: p.name, slug, shortDescription: p.short, description: p.desc, tags: p.tags,
        specs: p.specs.map(([label, value]) => ({ label, value })), status: "ACTIVE",
        isBestseller: !!p.bestseller, isFeatured: !!p.featured, categoryId: catId[p.category], ...labels[p.category],
        soldCount: FRESH ? 0 : p.bestseller ? 40 + ((idx * 13) % 60) : (idx * 7) % 25,
        createdAt: new Date(now - (catalogue.length - idx) * 36e5 * 20), // staggered → "New Arrivals" order
        images: { create: images.map((url, i) => ({ url, alt: `${p.name} — view ${i + 1}`, sortOrder: i })) },
        variants: { create: variants },
      },
    });
    productIds.push(created.id);
  }
  console.log(`✓ ${catalogue.length} products`);

  if (!FRESH) {
  // ── Reviews (approved + a couple pending for moderation) ──
  for (const [i, pid] of productIds.entries()) {
    if (i % 3 === 2) continue;
    const n = (i % 4) + 1;
    for (let r = 0; r < n; r++) {
      const rv = REVIEWS[(i + r) % REVIEWS.length];
      await prisma.review.create({ data: { productId: pid, ...rv, status: "APPROVED", createdAt: new Date(now - (i + r) * 864e5) } });
    }
  }
  await prisma.review.createMany({ data: [
    { productId: productIds[0], name: "Kamal U.", rating: 5, comment: "Just received it — stunning quality!", status: "PENDING" },
    { productId: productIds[21], name: "Ruma S.", rating: 4, comment: "Lovely scent, lasts all day at the office.", status: "PENDING" },
  ] });
  console.log("✓ Reviews");
  }

  // ── Banners, posts, coupons ──
  await prisma.banner.createMany({ data: BANNERS.map((b, i) => ({ ...b, sortOrder: i, isActive: true })) });
  for (const [i, p] of POSTS.entries()) await prisma.post.create({ data: { ...p, published: true, publishedAt: new Date(now - (i + 1) * 7 * 864e5) } });
  const coupons: Record<string, string> = {};
  for (const c of COUPONS) coupons[c.code] = (await prisma.coupon.create({ data: { ...c, isActive: true, expiresAt: new Date(now + 180 * 864e5) } })).id;
  console.log("✓ Banners, journal posts, coupons");

  if (!FRESH) {
  // ── Sample orders ──
  const flow = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] as const;
  const fees = { INSIDE_DHAKA: 70, DHAKA_SUBURBAN: 110, OUTSIDE_DHAKA: 150 };
  for (const o of SAMPLE_ORDERS) {
    const created = new Date(now - o.daysAgo * 864e5 - 2 * 36e5);
    const lines = [];
    for (const [pIdx, qty] of o.items) {
      const v = await prisma.productVariant.findFirstOrThrow({ where: { productId: productIds[pIdx], stock: { gt: 2 } }, include: { product: { include: { images: { take: 1 } } } } });
      lines.push({ v, qty });
    }
    const subtotal = lines.reduce((s, l) => s + l.v.price * l.qty, 0);
    const c = o.coupon ? COUPONS.find((x) => x.code === o.coupon)! : null;
    const discount = c ? (c.type === "FIXED" ? c.value : Math.min(Math.round((subtotal * c.value) / 100), c.maxDiscount ?? Infinity)) : 0;
    const shippingFee = fees[o.zone];
    const day = dhakaDayKey(created);
    const seq = await prisma.orderSequence.upsert({ where: { day }, create: { day, last: 1 }, update: { last: { increment: 1 } } });
    const customer = await prisma.customer.upsert({ where: { phone: o.phone }, create: { phone: o.phone, name: o.name, district: o.district }, update: {} });
    const reached = o.status === "CANCELLED" ? ["PENDING"] : flow.slice(0, flow.indexOf(o.status as (typeof flow)[number]) + 1);
    const events = [...reached, ...(o.status === "CANCELLED" ? ["CANCELLED"] : [])].map((s, i) => ({ status: s as (typeof flow)[number] | "CANCELLED", createdAt: new Date(created.getTime() + i * 6 * 36e5), note: i === 0 ? "Order placed · Cash on Delivery" : null }));
    await prisma.order.create({
      data: {
        orderNumber: `ZB-${day}-${String(seq.last).padStart(4, "0")}`, customerId: customer.id, customerName: o.name, phone: o.phone,
        address: o.address, district: o.district, thana: o.thana, zone: o.zone, status: o.status, subtotal, discount, shippingFee,
        total: subtotal - discount + shippingFee, couponCode: c?.code ?? null, couponId: c ? coupons[c.code] : null,
        stockRestored: o.status === "CANCELLED", createdAt: created,
        items: { create: lines.map(({ v, qty }) => ({ productId: v.productId, variantId: v.id, productName: v.product.name, variantLabel: variantLabel(v) || null, sku: v.sku, image: v.imageUrl ?? v.product.images[0]?.url, unitPrice: v.price, quantity: qty, lineTotal: v.price * qty })) },
        events: { create: events },
      },
    });
    if (o.status !== "CANCELLED") for (const { v, qty } of lines) await prisma.productVariant.update({ where: { id: v.id }, data: { stock: { decrement: qty } } });
    if (c && o.status !== "CANCELLED") await prisma.coupon.update({ where: { code: c.code }, data: { usedCount: { increment: 1 } } });
  }
  console.log(`✓ ${SAMPLE_ORDERS.length} sample orders`);

  await prisma.contactMessage.create({ data: { name: "Ayesha Siddiqua", email: "ayesha@example.com", phone: "01700112233", subject: "Corporate gifting", message: "Hi, we'd like 25 Heritage belts with gift boxes for our year-end corporate gifts. Do you offer bulk pricing?" } });
  }

  for (const id of productIds) await refreshProductAggregates(prisma, id);
  console.log(`✓ Aggregates refreshed\n\nSeed complete (${FRESH ? "FRESH store — 0 orders" : "DEMO data"}). Admin login →`, email);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
