"use server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { bannerInputSchema, categoryInputSchema, couponInputSchema, postInputSchema, settingsInputSchema } from "@/lib/validators";
import { refreshProductAggregates } from "@/lib/product-aggregates";
import { cleanHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };
const fail = (e: unknown, fallback: string): ActionResult => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { ok: false, error: "That value is already in use (must be unique)" };
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") return { ok: false, error: "This item is still in use and cannot be deleted" };
  console.error(e);
  return { ok: false, error: fallback };
};
const refreshAll = () => { revalidatePath("/", "layout"); };

// ---------- Categories ----------
export async function saveCategory(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const p = categoryInputSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const data = { ...p.data, slug: slugify(p.data.slug || p.data.name), image: p.data.image ?? null, description: p.data.description || null };
  try {
    const c = id ? await prisma.category.update({ where: { id }, data }) : await prisma.category.create({ data });
    refreshAll();
    return { ok: true, id: c.id };
  } catch (e) { return fail(e, "Could not save category"); }
}
export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  const n = await prisma.product.count({ where: { categoryId: id } });
  if (n) return { ok: false, error: `Move or delete its ${n} product(s) first` };
  try { await prisma.category.delete({ where: { id } }); refreshAll(); return { ok: true }; } catch (e) { return fail(e, "Could not delete"); }
}

// ---------- Banners ----------
export async function saveBanner(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const p = bannerInputSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const data = { ...p.data, subheading: p.data.subheading || null, ctaText: p.data.ctaText || null, ctaLink: p.data.ctaLink || null };
  try {
    if (id) await prisma.banner.update({ where: { id }, data });
    else { const max = await prisma.banner.aggregate({ _max: { sortOrder: true } }); await prisma.banner.create({ data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 } }); }
    refreshAll();
    return { ok: true };
  } catch (e) { return fail(e, "Could not save banner"); }
}
export async function deleteBanner(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.banner.delete({ where: { id } }); refreshAll(); return { ok: true };
}
export async function reorderBanners(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  await prisma.$transaction(ids.map((id, i) => prisma.banner.update({ where: { id }, data: { sortOrder: i } })));
  refreshAll(); return { ok: true };
}

// ---------- Coupons ----------
export async function saveCoupon(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const p = couponInputSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const { expiresAt, ...rest } = p.data;
  // expiry is end-of-day Dhaka time
  const data = { ...rest, maxDiscount: rest.type === "PERCENTAGE" ? rest.maxDiscount : null, expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59+06:00`) : null };
  try {
    if (id) await prisma.coupon.update({ where: { id }, data }); else await prisma.coupon.create({ data });
    revalidatePath("/admin/coupons"); return { ok: true };
  } catch (e) { return fail(e, "Could not save coupon"); }
}
export async function deleteCoupon(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } }); revalidatePath("/admin/coupons"); return { ok: true };
}

// ---------- Reviews ----------
export async function moderateReview(id: string, action: "APPROVED" | "REJECTED" | "DELETE"): Promise<ActionResult> {
  await requireAdmin();
  const r = await prisma.review.findUnique({ where: { id } });
  if (!r) return { ok: false, error: "Not found" };
  if (action === "DELETE") await prisma.review.delete({ where: { id } });
  else await prisma.review.update({ where: { id }, data: { status: action } });
  await refreshProductAggregates(prisma, r.productId);
  refreshAll(); return { ok: true };
}

// ---------- Messages ----------
export async function setMessageRead(id: string, isRead: boolean): Promise<ActionResult> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { isRead } }); revalidatePath("/admin", "layout"); return { ok: true };
}
export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } }); revalidatePath("/admin", "layout"); return { ok: true };
}

// ---------- Journal ----------
export async function savePost(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const p = postInputSchema.safeParse(input);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const existing = id ? await prisma.post.findUnique({ where: { id } }) : null;
  const data = {
    title: p.data.title, slug: slugify(p.data.slug || p.data.title), excerpt: p.data.excerpt || null, coverImage: p.data.coverImage,
    body: cleanHtml(p.data.body), tags: [...new Set(p.data.tags.map((t) => t.toLowerCase()))], published: p.data.published,
    publishedAt: p.data.published ? existing?.publishedAt ?? new Date() : null,
  };
  try {
    const post = id ? await prisma.post.update({ where: { id }, data }) : await prisma.post.create({ data });
    refreshAll(); return { ok: true, id: post.id };
  } catch (e) { return fail(e, "Could not save post"); }
}
export async function deletePost(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.post.delete({ where: { id } }); refreshAll(); return { ok: true };
}

// ---------- Settings ----------
export async function saveSettings(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const p = settingsInputSchema.safeParse(input);
  if (!p.success) return { ok: false, error: `${p.error.issues[0].path.join(".")}: ${p.error.issues[0].message}` };
  const n = (v?: string) => (v ? v : null);
  const d = p.data;
  const data = { ...d, contactPhone: n(d.contactPhone), contactEmail: n(d.contactEmail), address: n(d.address), facebookUrl: n(d.facebookUrl), instagramUrl: n(d.instagramUrl), tiktokUrl: n(d.tiktokUrl), youtubeUrl: n(d.youtubeUrl) };
  await prisma.storeSettings.upsert({ where: { id: "store" }, create: { id: "store", ...data }, update: data });
  refreshAll(); return { ok: true };
}
