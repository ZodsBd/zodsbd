// Static editorial imagery for the homepage. Replace with your own Vercel Blob URLs anytime.
const u = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const STORY_IMAGE = u("photo-1473188588951-666fce8e7c68", 1000);

export const INSTAGRAM_IMAGES = [
  u("photo-1548036328-c9fa89d128fa", 500),
  u("photo-1541643600914-78b084683601", 500),
  u("photo-1553062407-98eeb64c6a62", 500),
  u("photo-1624222247344-550fb60583dc", 500),
  u("photo-1566150905458-1bf1fc113f0d", 500),
  u("photo-1594035910387-fea47794261f", 500),
];
