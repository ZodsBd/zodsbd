/**
 * ALL seed imagery lives here. To use your own photos:
 * upload them via Admin → Products (Vercel Blob), or replace these URLs
 * with your own and re-run `npm run db:seed`.
 */
const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  backpacks: [u("photo-1553062407-98eeb64c6a62"), u("photo-1622560480605-d83c853bc5c3"), u("photo-1581605405669-fcdf81165afa"), u("photo-1491637639811-60e2756cc1c7"), u("photo-1547949003-9792a18a2601")],
  belts: [u("photo-1624222247344-550fb60583dc"), u("photo-1664286074176-5206ee5dc878"), u("photo-1611923134239-b9be5816e23c"), u("photo-1575844264771-892081089af5"), u("photo-1627123424574-724758594e93")],
  cases: [u("photo-1606760227091-3dd870d97f1d"), u("photo-1600185365926-3a2ce3cdb9eb"), u("photo-1559563458-527698bf5295"), u("photo-1612817288484-6f916006741a")],
  perfumes: [u("photo-1541643600914-78b084683601"), u("photo-1594035910387-fea47794261f"), u("photo-1592945403244-b3fbafd7f539"), u("photo-1523293182086-7651a899d37f"), u("photo-1587017539504-67cfbddac569"), u("photo-1605733160314-4fc7dac4bb16")],
  clutches: [u("photo-1566150905458-1bf1fc113f0d"), u("photo-1584917865442-de89df76afd3"), u("photo-1590874103328-eac38a683ce7"), u("photo-1614179689702-355944cd0918"), u("photo-1548036328-c9fa89d128fa"), u("photo-1590739225287-bd31519780c3")],
  banners: [u("photo-1509631179647-0177331693ae", 2000), u("photo-1445205170230-053b83016050", 2000), u("photo-1558769132-cb1aea458c5e", 2000)],
  journal: [u("photo-1473188588951-666fce8e7c68", 1600), u("photo-1585386959984-a4155224a1ad", 1600), u("photo-1616949755610-8c9bbc08f138", 1600)],
  categories: {
    backpacks: u("photo-1553062407-98eeb64c6a62", 1000),
    belts: u("photo-1624222247344-550fb60583dc", 1000),
    "cigarette-cases": u("photo-1606760227091-3dd870d97f1d", 1000),
    perfumes: u("photo-1541643600914-78b084683601", 1000),
    "clutch-bags": u("photo-1566150905458-1bf1fc113f0d", 1000),
  },
};

/** Picks n images from a pool starting at an offset (rotates so products look varied). */
export const pick = (pool: string[], offset: number, n = 3) => Array.from({ length: n }, (_, i) => pool[(offset + i) % pool.length]);
