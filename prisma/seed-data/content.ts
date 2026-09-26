import { IMG } from "./images";

export const BANNERS = [
  { image: IMG.banners[0], heading: "The Art of Carrying Well", subheading: "Full-grain leather backpacks and belts, finished by hand.", ctaText: "Shop Backpacks", ctaLink: "/category/backpacks" },
  { image: IMG.banners[1], heading: "Evenings, Elevated", subheading: "Hand-beaded clutches for weddings and celebrations.", ctaText: "Discover Clutches", ctaLink: "/category/clutch-bags" },
  { image: IMG.banners[2], heading: "Signature Scents", subheading: "Oud, amber and vetiver — crafted to last all day.", ctaText: "Explore Perfumes", ctaLink: "/category/perfumes" },
];

export const POSTS = [
  { title: "How to Care for Full-Grain Leather in Bangladesh's Humidity", slug: "leather-care-humidity", coverImage: IMG.journal[0], tags: ["care", "leather"],
    excerpt: "Monsoon-proof habits that keep your belts and bags looking beautiful for a decade.",
    body: "<p>Full-grain leather is a living material. In Dhaka's humid months it absorbs moisture, and without care it can dull or develop mould.</p><h2>1. Let it breathe</h2><p>Store leather in the cotton dust bag it came with — never in plastic.</p><h2>2. Condition every season</h2><p>A pea-sized amount of leather balm, worked in with a soft cloth, restores oils lost to heat and air-conditioning.</p><blockquote>Leather rewards patience. The patina you build is uniquely yours.</blockquote><h2>3. Dry naturally</h2><p>Caught in the rain? Pat dry and leave at room temperature — never near a heater or in direct sun.</p>" },
  { title: "The Wedding Season Edit: Clutches for Every Ceremony", slug: "wedding-season-clutch-edit", coverImage: IMG.journal[1], tags: ["lookbook", "wedding"],
    excerpt: "From gaye holud to reception — the right clutch for every celebration.",
    body: "<p>A Bangladeshi wedding is a week of celebrations, each with its own mood.</p><h2>Gaye Holud</h2><p>Go playful with our <strong>Woven Jute Heritage Clutch</strong> in ivory — light, festive and rooted in tradition.</p><h2>The Wedding Day</h2><p>The <strong>Maharani Embellished Clutch</strong> pairs beautifully with a jamdani or Benarasi saree.</p><h2>Reception</h2><p>Finish with the <strong>Golden Hour Box Clutch</strong> — sculptural, metallic and made for photographs.</p>" },
  { title: "Finding Your Signature Scent", slug: "finding-your-signature-scent", coverImage: IMG.journal[2], tags: ["fragrance", "guide"],
    excerpt: "A simple guide to fragrance families, longevity and wearing perfume in the tropics.",
    body: "<p>A signature scent is remembered long after you leave the room. Here's how to find yours.</p><h2>Know the families</h2><ul><li><strong>Fresh</strong> — citrus, vetiver, green tea. Perfect for daytime heat.</li><li><strong>Woody Oriental</strong> — oud, amber, sandalwood. Rich evening wear.</li><li><strong>Floral</strong> — rose, jasmine, peony. Romantic and versatile.</li></ul><h2>Apply to pulse points</h2><p>Wrists, neck and behind the ears. Don't rub — it breaks the top notes.</p><p>Start with a 30ml bottle and wear it for a week before committing to a larger size.</p>" },
];

export const COUPONS = [
  { code: "WELCOME10", type: "PERCENTAGE" as const, value: 10, minOrderValue: 1500, maxDiscount: 1000, usageLimit: 500 },
  { code: "ZODS500", type: "FIXED" as const, value: 500, minOrderValue: 5000, maxDiscount: null, usageLimit: 100 },
];

export const REVIEWS = [
  { name: "Tahmid R.", rating: 5, comment: "Exceptional quality. The leather smells amazing and the stitching is flawless." },
  { name: "Nusrat J.", rating: 5, comment: "Arrived in Chattogram in 3 days, beautifully packaged. Perfect gift." },
  { name: "Arif H.", rating: 4, comment: "Very good product, slightly darker than the photo but I love it." },
  { name: "Sadia K.", rating: 5, comment: "Worth every taka. Customer service was very helpful on WhatsApp." },
];
