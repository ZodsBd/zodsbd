import { z } from "zod";
import { DISTRICTS } from "../districts";
import { BD_PHONE_REGEX, normalizePhone } from "../phone";

export const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine((v) => BD_PHONE_REGEX.test(v), "Enter a valid BD mobile number (01XXXXXXXXX)");

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const zoneSchema = z.enum(["INSIDE_DHAKA", "DHAKA_SUBURBAN", "OUTSIDE_DHAKA"]);

export const cartLineSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: phoneSchema,
  email: optionalEmail,
  address: z.string().trim().min(8, "Enter your full address").max(300),
  district: z.enum(DISTRICTS, { errorMap: () => ({ message: "Select your district" }) }),
  thana: z.string().trim().min(2, "Enter your thana / upazila").max(80),
  zone: zoneSchema,
  notes: z.string().trim().max(500).optional(),
});
export type CheckoutInput = z.input<typeof checkoutSchema>;

export const orderRequestSchema = checkoutSchema.extend({
  items: z.array(cartLineSchema).min(1, "Your cart is empty").max(50),
  couponCode: z.string().trim().max(40).optional(),
});

export const quoteSchema = z.object({
  items: z.array(cartLineSchema).max(50),
  couponCode: z.string().trim().max(40).optional(),
  zone: zoneSchema,
});

export const trackSchema = z.object({
  orderNumber: z.string().trim().toUpperCase().regex(/^ZB-\d{6}-\d{4}$/, "Format: ZB-YYMMDD-XXXX"),
  phone: phoneSchema,
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().trim().min(2, "Enter your name").max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5, "Write a few words").max(1000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: optionalEmail,
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Message is too short").max(3000),
});

export const newsletterSchema = z.object({ email: z.string().trim().email("Enter a valid email") });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password required"),
});

// ---------- Admin ----------
const nullableInt = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
  z.number().int().min(0).nullable()
);

export const variantInputSchema = z.object({
  id: z.string().optional(),
  sku: z.string().trim().min(1, "SKU required").max(60),
  color: z.string().trim().max(40).nullable().optional(),
  size: z.string().trim().max(40).nullable().optional(),
  price: z.coerce.number().int().min(0),
  compareAtPrice: nullableInt,
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(90).optional(),
  shortDescription: z.string().trim().max(240).optional(),
  description: z.string().trim().min(1, "Description required"),
  categoryId: z.string().min(1, "Choose a category"),
  tags: z.array(z.string().trim().min(1)).default([]),
  specs: z.array(z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) })).default([]),
  status: z.enum(["ACTIVE", "DRAFT"]),
  isFeatured: z.boolean(),
  isBestseller: z.boolean(),
  colorLabel: z.string().trim().max(30).nullable().optional(),
  sizeLabel: z.string().trim().max(30).nullable().optional(),
  sizeGuide: z.enum(["belt", "backpack"]).nullable().optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).default([]),
  variants: z.array(variantInputSchema).min(1, "Add at least one variant"),
});
export type ProductInput = z.input<typeof productInputSchema>;

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().max(60).optional(),
  description: z.string().trim().max(300).optional(),
  image: z.string().url().optional().or(z.literal("").transform(() => undefined)),
  sortOrder: z.coerce.number().int().default(0),
});

export const bannerInputSchema = z.object({
  image: z.string().url("Upload an image"),
  heading: z.string().trim().min(2).max(120),
  subheading: z.string().trim().max(240).optional(),
  ctaText: z.string().trim().max(40).optional(),
  ctaLink: z.string().trim().max(200).optional(),
  isActive: z.boolean(),
});

export const couponInputSchema = z
  .object({
    code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,30}$/, "3–30 letters/numbers"),
    type: z.enum(["FIXED", "PERCENTAGE"]),
    value: z.coerce.number().int().min(1),
    minOrderValue: z.coerce.number().int().min(0).default(0),
    maxDiscount: nullableInt,
    usageLimit: nullableInt,
    expiresAt: z.string().optional().nullable(),
    isActive: z.boolean(),
  })
  .refine((c) => c.type !== "PERCENTAGE" || c.value <= 100, { message: "Percentage must be ≤ 100", path: ["value"] });

export const postInputSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(120).optional(),
  excerpt: z.string().trim().max(300).optional(),
  coverImage: z.string().url("Upload a cover image"),
  body: z.string().min(1, "Write something"),
  tags: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean(),
});

export const settingsInputSchema = z.object({
  shippingInsideDhaka: z.coerce.number().int().min(0),
  shippingSubDhaka: z.coerce.number().int().min(0),
  shippingOutsideDhaka: z.coerce.number().int().min(0),
  whatsappNumber: z.string().trim().regex(/^\d{10,15}$/, "Digits only, with country code e.g. 8801XXXXXXXXX"),
  contactPhone: z.string().trim().max(30).optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().max(300).optional(),
  facebookUrl: z.string().trim().url().optional().or(z.literal("")),
  instagramUrl: z.string().trim().url().optional().or(z.literal("")),
  tiktokUrl: z.string().trim().url().optional().or(z.literal("")),
  youtubeUrl: z.string().trim().url().optional().or(z.literal("")),
});
