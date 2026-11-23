import { NextResponse } from "next/server";
import { z } from "zod";
import { priceItems } from "@/lib/pricing";
import { isGovernorate, shippingFee } from "@/lib/shipping";
import { getSupabase } from "@/lib/supabase";
import { notifyTelegram } from "@/lib/notify";
import { EG_PHONE, normalizePhone } from "@/lib/validation";

const orderSchema = z.object({
  name: z.string().trim().min(3, "اكتب الاسم بالكامل").max(100),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => EG_PHONE.test(v), "رقم الموبايل غير صحيح (11 رقم بيبدأ بـ 01)"),
  governorate: z.string().refine(isGovernorate, "اختار المحافظة"),
  city: z.string().trim().min(2, "اكتب المدينة أو المنطقة").max(100),
  address: z.string().trim().min(8, "اكتب العنوان بالتفصيل").max(300),
  notes: z.string().trim().max(500).optional(),
  paymentMethod: z.literal("cod"),
  // حقل مصيدة للبوتات: البشر مبيشوفوهوش فمبيكتبوش فيه
  website: z.string().max(0).optional(),
  items: z
    .array(
      z.object({
        slug: z.string().max(100),
        size: z.string().max(20),
        color: z.string().max(40),
        qty: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "السلة فاضية")
    .max(20),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // الأسعار والمخزون بتتحسب هنا من ملف المنتجات، مش من المتصفح
  const priced = priceItems(data.items);
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: 400 });
  }
  const shipping = shippingFee(data.governorate, priced.subtotal);
  if (shipping === null) {
    return NextResponse.json({ error: "اختار المحافظة" }, { status: 400 });
  }
  const total = priced.subtotal + shipping;

  const supabase = getSupabase();
  let orderNo: number;

  if (!supabase) {
    // في التطوير بدون Supabase: نطبع الأوردر في التيرمنال ونكمل. في الإنتاج ده خطأ إعدادات.
    if (process.env.NODE_ENV === "production") {
      console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY مش متضبطين");
      return NextResponse.json({ error: "حصلت مشكلة عندنا، جرب تاني بعد شوية." }, { status: 500 });
    }
    orderNo = Math.floor(1000 + Math.random() * 9000);
    console.log(`[DEV] order #${orderNo}`, JSON.stringify({ ...data, total }, null, 2));
  } else {
    const { data: row, error } = await supabase
      .from("orders")
      .insert({
        customer_name: data.name,
        phone: data.phone,
        governorate: data.governorate,
        city: data.city,
        address: data.address,
        notes: data.notes || null,
        items: priced.lines,
        subtotal: priced.subtotal,
        shipping,
        total,
        payment_method: data.paymentMethod,
      })
      .select("order_no")
      .single();

    if (error || !row) {
      console.error("order insert failed", error);
      return NextResponse.json({ error: "حصلت مشكلة عندنا، جرب تاني بعد شوية." }, { status: 500 });
    }
    orderNo = row.order_no;
  }

  const itemsText = priced.lines
    .map((l) => `• ${l.name} (${l.size} / ${l.color}) × ${l.qty}`)
    .join("\n");
  await notifyTelegram(
    `أوردر جديد #${orderNo}\n${data.name} · ${data.phone}\n${data.governorate} - ${data.city}\n${data.address}\n\n${itemsText}\n\nالإجمالي: ${total} ج.م (شحن ${shipping}) · دفع عند الاستلام`,
  );

  return NextResponse.json({ orderNo });
}
