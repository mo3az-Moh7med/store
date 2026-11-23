// أسعار الشحن حسب المحافظة. الأرقام دي أمثلة: عدّلها حسب شركة الشحن اللي هتتعامل معاها.

type Zone = 1 | 2 | 3 | 4;

export const ZONE_FEES: Record<Zone, number> = {
  1: 60, // القاهرة الكبرى والإسكندرية
  2: 70, // الدلتا والقناة
  3: 90, // الصعيد
  4: 110, // المحافظات الحدودية
};

// الشحن مجاني لو إجمالي المنتجات وصل للمبلغ ده أو زاد. خليه 0 لو مش عايز عرض شحن مجاني.
export const FREE_SHIPPING_OVER = 1500;

export const GOVERNORATES: { name: string; zone: Zone }[] = [
  { name: "القاهرة", zone: 1 },
  { name: "الجيزة", zone: 1 },
  { name: "الإسكندرية", zone: 1 },
  { name: "القليوبية", zone: 2 },
  { name: "الشرقية", zone: 2 },
  { name: "الدقهلية", zone: 2 },
  { name: "الغربية", zone: 2 },
  { name: "المنوفية", zone: 2 },
  { name: "البحيرة", zone: 2 },
  { name: "كفر الشيخ", zone: 2 },
  { name: "دمياط", zone: 2 },
  { name: "بورسعيد", zone: 2 },
  { name: "الإسماعيلية", zone: 2 },
  { name: "السويس", zone: 2 },
  { name: "الفيوم", zone: 3 },
  { name: "بني سويف", zone: 3 },
  { name: "المنيا", zone: 3 },
  { name: "أسيوط", zone: 3 },
  { name: "سوهاج", zone: 3 },
  { name: "قنا", zone: 3 },
  { name: "الأقصر", zone: 3 },
  { name: "أسوان", zone: 3 },
  { name: "البحر الأحمر", zone: 4 },
  { name: "الوادي الجديد", zone: 4 },
  { name: "مطروح", zone: 4 },
  { name: "شمال سيناء", zone: 4 },
  { name: "جنوب سيناء", zone: 4 },
];

export function isGovernorate(name: string): boolean {
  return GOVERNORATES.some((g) => g.name === name);
}

/** مصاريف الشحن، أو null لو المحافظة لسه متحددتش. */
export function shippingFee(governorate: string | undefined, subtotal: number): number | null {
  if (FREE_SHIPPING_OVER > 0 && subtotal >= FREE_SHIPPING_OVER) return 0;
  const gov = GOVERNORATES.find((g) => g.name === governorate);
  return gov ? ZONE_FEES[gov.zone] : null;
}
