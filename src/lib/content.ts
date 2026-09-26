// Static copy for FAQ & policy pages. Edit freely.
export const FAQS = [
  { q: "How does Cash on Delivery work?", a: "Place your order online, and pay the courier in cash when your parcel arrives. There is no online payment required." },
  { q: "How long does delivery take?", a: "Inside Dhaka: 1–2 working days. Dhaka sub-urban: 2–3 working days. Outside Dhaka: 3–5 working days." },
  { q: "How much is shipping?", a: "Shipping is a flat rate by zone: Inside Dhaka ৳70, Dhaka Sub-urban ৳110, Outside Dhaka ৳150. The exact fee is shown at checkout." },
  { q: "Can I exchange an item?", a: "Yes — within 7 days of delivery for unused items with tags and original packaging. Perfumes can be exchanged only if unopened and sealed." },
  { q: "Are your products authentic?", a: "Every product is 100% authentic and inspected by hand before dispatch." },
  { q: "How do I track my order?", a: "Visit Track My Order and enter your order number (ZB-YYMMDD-XXXX) and phone number. You'll also see all past orders placed with that phone." },
  { q: "How do I choose a belt size?", a: "Pick a belt two sizes above your trouser waist. For example, if you wear 32 trousers, choose a 34 belt. See the size guide on any belt page." },
  { q: "Can I change or cancel my order?", a: "Yes, call or WhatsApp us before your order is shipped and we'll update or cancel it." },
];

export const POLICIES: Record<string, { title: string; body: string }> = {
  shipping: {
    title: "Shipping Policy",
    body: `<p>We deliver to all 64 districts of Bangladesh via trusted courier partners.</p>
<h2>Rates</h2><ul><li>Inside Dhaka — ৳70</li><li>Dhaka Sub-urban (Gazipur, Narayanganj, Savar, Keraniganj, etc.) — ৳110</li><li>Outside Dhaka — ৳150</li></ul>
<p>Rates are flat per order regardless of weight. Current rates are always shown at checkout.</p>
<h2>Delivery time</h2><p>Inside Dhaka 1–2 working days, sub-urban 2–3, outside Dhaka 3–5 working days after confirmation. Delays may occur during public holidays or severe weather.</p>
<h2>Order confirmation</h2><p>Our team will call you to confirm every Cash on Delivery order before dispatch. Unreachable orders may be cancelled after 48 hours.</p>`,
  },
  returns: {
    title: "Return & Exchange Policy",
    body: `<p>We want you to love every piece. If something isn't right, we offer a <strong>7-day exchange</strong>.</p>
<h2>Eligibility</h2><ul><li>Request within 7 days of delivery.</li><li>Item unused, with tags and original packaging.</li><li>Perfumes: only unopened, sealed bottles.</li></ul>
<h2>How to exchange</h2><ol><li>Contact us by phone or WhatsApp with your order number.</li><li>We'll arrange a pickup or you can send the item back.</li><li>Once inspected, we dispatch your replacement.</li></ol>
<h2>Damaged or wrong items</h2><p>If you receive a damaged or incorrect item, please inform us within 48 hours with photos and we'll replace it at no cost, including shipping.</p>
<h2>Refunds</h2><p>Where an exchange isn't possible, we refund via bKash/Nagad or bank transfer within 7 working days.</p>`,
  },
  privacy: {
    title: "Privacy Policy",
    body: `<p>Your privacy matters to us. This policy explains what we collect and why.</p>
<h2>What we collect</h2><p>Name, phone, email (optional), delivery address and order details — only what's needed to deliver your order and provide support.</p>
<h2>How we use it</h2><ul><li>Processing and delivering orders</li><li>Order confirmation calls and support</li><li>Newsletter emails, only if you subscribe</li></ul>
<h2>Sharing</h2><p>We share delivery details only with our courier partners. We never sell your data.</p>
<h2>Storage</h2><p>Your cart and wishlist are stored in your own browser. Order data is kept on secure cloud servers.</p>
<h2>Your rights</h2><p>Contact us anytime to view, correct or delete your information.</p>`,
  },
  terms: {
    title: "Terms & Conditions",
    body: `<p>By using this website and placing an order, you agree to these terms.</p>
<h2>Orders</h2><p>All orders are subject to availability and confirmation. We reserve the right to cancel orders with incorrect information or suspected misuse.</p>
<h2>Pricing</h2><p>Prices are in Bangladeshi Taka (৳) and include applicable taxes. Shipping is charged separately by zone. Prices may change without notice, but confirmed orders are honoured at the ordered price.</p>
<h2>Payment</h2><p>We currently accept Cash on Delivery only. Please pay the exact amount to the courier.</p>
<h2>Coupons</h2><p>Coupons are subject to their stated conditions, cannot be combined, and have no cash value.</p>
<h2>Liability</h2><p>Our liability is limited to the value of the product purchased.</p>
<h2>Governing law</h2><p>These terms are governed by the laws of Bangladesh.</p>`,
  },
};
