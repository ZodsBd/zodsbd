# Zod's Bd — Luxury Accessories E-commerce

Premium storefront + full admin for **Zod's Bd** (Bangladesh). Cash-on-Delivery only, BDT pricing, nationwide delivery.

**Stack:** Next.js 15 (App Router, TypeScript strict) · Tailwind + shadcn-style UI · framer-motion · Prisma + Neon Postgres · Vercel Blob · Zustand · react-hook-form + zod · JWT (jose) + bcryptjs.
Fully serverless — no native binaries, no filesystem writes, no long-running processes.

---

## Features

**Storefront:** hero slider (admin banners) · category grid · New Arrivals / Bestsellers carousels · shop + category pages with filters (category, price, colour, size, in-stock, on-sale), sort, search, pagination · product page (gallery + hover zoom, variant selector with sold-out states, compare-at price + −X% badge, qty, Add to Bag / Buy Now / Wishlist, specs accordion, size guides for belts & backpacks, reviews, related) · cart drawer + cart page (coupon, live zone shipping) · COD checkout (BD phone validation, 64 districts, thana, zone) · order confirmation (`ZB-YYMMDD-XXXX`) · Track My Order (order no + phone → status timeline + all orders for that phone) · wishlist · journal/lookbook · about, contact (saved to DB), FAQ, 4 policy pages · custom 404 · WhatsApp button · mobile bottom nav.

**Admin (`/admin`):** dashboard (today's orders & revenue, pending COD value, status counts, 7/30-day revenue chart, top 5 products, low-stock < 5) · orders (search, status + date filters, detail, status change with public timeline note, internal notes, delete, CSV export, A4 invoice & packing slip) · products (search/filter, create/edit/delete, multi-image Blob upload with drag-reorder, variant generator + per-variant SKU/price/compare-at/stock/image, specs, tags, draft/active, featured/bestseller) · categories · customers (grouped by phone) · banners (drag-reorder) · coupons · review moderation · contact inbox · journal (rich-text editor) · settings (shipping rates, WhatsApp, contact, socials).

**SEO:** Metadata on every page, dynamic OG images (home, product, post), JSON-LD (Organization, Product + AggregateOffer + AggregateRating, BreadcrumbList, Article, FAQPage), `sitemap.xml`, `robots.txt`.

## Data integrity notes
- Prices are whole Taka (`Int`). The server **re-prices every cart** — client prices are never trusted.
- Order creation runs in one transaction: conditional stock decrement (`stock >= qty`) prevents overselling, coupon usage is limit-checked atomically, order numbers come from a per-day counter row.
- Cancelling an order restores stock and coupon usage exactly once (`stockRestored` flag); re-opening re-deducts.
- Products store denormalised `minPrice / onSale / totalStock / ratingAvg` fields, refreshed on every change, so shop filtering and sorting stay fast.

---

## 1. Local setup
```bash
git clone https://github.com/<you>/zods-bd.git && cd zods-bd
npm install               # Node 20+
cp .env.example .env      # then fill in values (see below)
npx prisma migrate deploy # create tables
npm run db:seed           # demo data + admin user
npm run dev               # http://localhost:3000
```

## 2. Neon Postgres
1. Create a project at <https://neon.tech> (region: Singapore `ap-southeast-1` is closest to Bangladesh).
2. **Dashboard → Connect**: copy the **Pooled** string (host contains `-pooler`) → `DATABASE_URL`.
3. Turn pooling off and copy the **Direct** string → `DATABASE_URL_UNPOOLED`.
4. Both should end in `?sslmode=require`.

The app uses the pooled URL at runtime (safe for many serverless instances); Prisma migrations use the direct URL (`directUrl` in `schema.prisma`). A single Prisma client is reused per instance (`src/lib/prisma.ts`).

## 3. Vercel Blob (image uploads)
Vercel dashboard → **Storage → Create → Blob** → connect it to your project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically. For local uploads, copy that token into `.env`. Max 4.5 MB per image (JPG/PNG/WebP/AVIF).

## 4. Migrations
```bash
npx prisma migrate dev --name <change>   # when you edit schema.prisma (local)
npx prisma migrate deploy                # apply to Neon (production)
```

## 5. Seeding
Both commands **wipe existing catalogue, orders and customers** first.

| Command | Result |
|---|---|
| `npm run db:seed` | **Fresh store (use for launch):** admin user, 5 categories, **7 starter products** (at least one per category) with full variants, 3 banners, 3 journal posts, 2 coupons. **0 orders, 0 revenue, 0 customers, 0 reviews.** |
| `npm run db:seed:demo` | **Demo data:** 35 products, reviews, 8 sample orders across all statuses. Useful for testing the dashboard. |

To choose different starter products, edit `FRESH_PICK` in `prisma/seed.ts` (indexes into `prisma/seed-data/products.ts`).
**Using your own photos:** all seed image URLs live in `prisma/seed-data/images.ts`. Or just upload real photos from Admin → Products; they go to Vercel Blob.

## 6. Admin login
Go to `/admin` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Re-running the seed updates that admin's password. **Change the default password before going live.**

## 7. Deploy: GitHub → Vercel
1. Push this repo to GitHub.
2. <https://vercel.com/new> → Import the repo. The framework is auto-detected as Next.js; the build command comes from `package.json` (`prisma generate && next build`).
3. **Settings → Environment Variables** (Production + Preview): `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `JWT_SECRET` (run `openssl rand -base64 48`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `NEXT_PUBLIC_SITE_URL` (for example `https://zodsbd.com`). Tip: Vercel's Neon integration can add both DB URLs for you.
4. Connect a Blob store (step 3).
5. From your machine, pointing at Neon: `npx prisma migrate deploy && npm run db:seed` (one time only).
6. Deploy. Then add your domain under **Settings → Domains** and update `NEXT_PUBLIC_SITE_URL`.
7. In Admin → Settings, set your WhatsApp number, phone, email, address and social links.

## Environment variables
See `.env.example`. Every secret is read from `process.env`; nothing is hard-coded.

## Project structure
```
prisma/            schema.prisma, migrations/, seed.ts, seed-data/ (images, products, content, orders)
src/app/(store)/   storefront routes          src/app/admin/   login + (panel) admin routes
src/app/api/       route handlers (orders, quote, track, reviews, contact, newsletter, auth, admin upload/export)
src/actions/       admin server actions       src/components/  ui, brand, layout, home, product, shop, cart, checkout, order, admin, seo
src/lib/           prisma, auth, pricing, checkout, shipping, districts, validators, queries, seo …
src/store/         Zustand cart + wishlist (localStorage)
src/middleware.ts  protects /admin/* and /api/admin/*
```

## Scripts
`dev` · `build` · `start` · `lint` · `typecheck` · `db:migrate` · `db:deploy` · `db:push` · `db:seed` (fresh) · `db:seed:demo` · `db:studio`
