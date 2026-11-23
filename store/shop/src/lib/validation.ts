// رقم موبايل مصري: 11 رقم بيبدأ بـ 010 أو 011 أو 012 أو 015
export const EG_PHONE = /^01[0125]\d{8}$/;

/** بيحوّل الأرقام العربي لإنجليزي، ويشيل المسافات والشرطات، ويحوّل +20 لـ 0. */
export function normalizePhone(input: string): string {
  let s = input
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s\-()]/g, "");
  if (s.startsWith("+20")) s = "0" + s.slice(3);
  else if (s.startsWith("0020")) s = "0" + s.slice(4);
  return s;
}
