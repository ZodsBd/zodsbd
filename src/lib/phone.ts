/** BD mobile: 01[3-9]XXXXXXXX (11 digits). Accepts +880 / 880 prefixes and spaces/dashes. */
export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

export function normalizePhone(input: string): string {
  let p = input.replace(/[\s\-()]/g, "");
  if (p.startsWith("+880")) p = p.slice(3);
  else if (p.startsWith("880")) p = p.slice(2);
  return p;
}

export function isValidBDPhone(input: string): boolean {
  return BD_PHONE_REGEX.test(normalizePhone(input));
}
