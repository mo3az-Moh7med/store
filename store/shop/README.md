# متجر ملابس (Next.js + Supabase)

متجر بسيط بالعربي (RTL) لبيع الملابس في مصر: المنتجات في ملف، سلة، Checkout بالدفع عند الاستلام، والأوردرات بتتحفظ في Supabase.

## الاستراكشر

```
src/
├── app/
│   ├── layout.tsx            الشكل العام (عربي RTL، الهيدر والفوتر، السلة)
│   ├── page.tsx              الرئيسية: شبكة المنتجات
│   ├── products/[slug]/      صفحة المنتج (اختيار لون/مقاس/كمية)
│   ├── cart/                 السلة
│   ├── checkout/             نموذج الطلب + ملخص الأسعار
│   ├── thank-you/            صفحة بعد الطلب
│   ├── policies/             الاسترجاع والشحن والخصوصية
│   ├── api/orders/route.ts   API إنشاء الأوردر (التحقق + الحساب + الحفظ)
│   ├── sitemap.ts, robots.ts SEO
│   └── globals.css           كل الستايل
├── components/               ProductCard, AddToCart, Gallery, Header, Footer
├── data/products.ts          ⭐ المنتجات والمخزون (هنا بتعدّل)
└── lib/
    ├── config.ts             اسم المتجر + واتساب + رابط الموقع
    ├── shipping.ts           المحافظات وأسعار الشحن
    ├── pricing.ts            حساب الأسعار والمخزون (واجهة + سيرفر)
    ├── cart.tsx              حالة السلة (localStorage)
    ├── validation.ts         التحقق من رقم الموبايل المصري
    ├── supabase.ts           اتصال Supabase (سيرفر بس)
    └── notify.ts             إشعار تليجرام (اختياري)
supabase/schema.sql           جدول orders
```

### مسار الطلب

1. العميل يختار منتج/لون/مقاس ← يتضاف للسلة (محفوظة في المتصفح).
2. صفحة checkout ← يكتب بياناته ويختار المحافظة ← الشحن بيتحسب.
3. المتصفح يبعت `POST /api/orders` بالأصناف والبيانات **من غير أسعار**.
4. السيرفر يتحقق من البيانات، ويحسب الأسعار والمخزون من `products.ts` (مبيثقش في المتصفح)، ويحفظ في Supabase، ويبعتلك إشعار تليجرام.
5. العميل يروح لصفحة الشكر برقم الأوردر.

## التشغيل على جهازك

محتاج Node 18.18 أو أحدث.

```bash
cd shop
cp .env.example .env.local
npm install
npm run dev
```

افتح http://localhost:3000. **من غير Supabase**: الأوردر بيتطبع في التيرمنال والموقع بيكمل عادي (للتجربة بس؛ في الإنتاج لازم Supabase).

للتأكد من الأنواع: `npm run typecheck`.

## إعداد Supabase (حفظ الأوردرات)

1. اعمل مشروع على supabase.com.
2. SQL Editor ← الصق محتوى `supabase/schema.sql` ← Run.
3. Project Settings ← API ← انسخ `Project URL` و `service_role key` في `.env.local`:
   `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY`.
4. الـ service_role سري: متحطوش في متغير يبدأ بـ `NEXT_PUBLIC` ومترفعوش على GitHub.
5. الأوردرات بتظهر في Table Editor ← `orders`، وتقدر تغيّر `status` من هناك (new / confirmed / shipped / delivered / cancelled / returned).

## إشعار تليجرام (اختياري)

كلّم @BotFather واعمل بوت، حط `TELEGRAM_BOT_TOKEN` و `TELEGRAM_CHAT_ID` في الـ env، وكل أوردر جديد هيجيلك رسالة.

## تعديل المتجر

| عايز تعدّل | الملف |
|---|---|
| منتجات / أسعار / مخزون | `src/data/products.ts` |
| صور المنتجات | حطها في `public/products/` وسجّل مسارها في `images` |
| اسم المتجر وواتساب | `src/lib/config.ts` |
| أسعار الشحن والشحن المجاني | `src/lib/shipping.ts` |
| نصوص الاسترجاع والشحن | `src/app/policies/page.tsx` |
| الألوان والشكل | متغيرات `:root` في `src/app/globals.css` |

## النشر (الإنتاج)

1. ارفع المشروع على GitHub (من غير `.env.local`).
2. على vercel.com: Add New ← Project ← اختار الريبو ← Deploy.
3. من Settings ← Environment Variables أضف كل متغيرات `.env.example` بقيمها الحقيقية، و`NEXT_PUBLIC_SITE_URL` بدومينك (مثلًا `https://yourstore.com`). بعد الإضافة اعمل Redeploy.
4. اربط الدومين من Settings ← Domains، والـ HTTPS بيتفعل تلقائي.
5. بعد كده أي `git push` على main بيتنشر لوحده.

### قبل ما تفتح للبيع

- [ ] امسح منتجات المثال وحط منتجاتك بصورها ومخزونها الحقيقي.
- [ ] عدّل `config.ts` (الاسم، رقم واتساب) وأسعار الشحن حسب شركة الشحن.
- [ ] راجع صفحة السياسات: **نص مبدئي** (مدة الاسترجاع 14 يوم مثال). حدد سياستك الفعلية وراجعها مع قانون حماية المستهلك.
- [ ] جرّب أوردر كامل على الموقع المنشور وتأكد إنه ظهر في Supabase وجالك الإشعار.
- [ ] جرّب من موبايل حقيقي (أغلب زبايينك منه).
- [ ] فعّل Backups في Supabase (حسب خطتك) وفكّر في Sentry لمراقبة الأخطاء.
- [ ] لو هتعمل إعلانات فيسبوك/انستجرام ضيف Meta Pixel في `layout.tsx`.

## حدود معروفة (مقصودة للبساطة)

- **المخزون يدوي**: الأوردر مبينقّصش `stock` تلقائي. بعد البيع عدّل الأرقام في `products.ts` وارفع. لو اتباعت آخر قطعة وفي أوردر تاني جاي قبل ما تعدّل، هتتأكد منه بالتليفون (وده أصلًا اللي بتعمله في الدفع عند الاستلام).
- **مفيش حماية ضد السبام غير حقل مصيدة (honeypot)**. لو لقيت أوردرات وهمية، ضيف Rate limiting (مثلًا Upstash) أو Cloudflare Turnstile.
- **مفيش دفع أونلاين لسه**، وده الخطوة الجاية.

## إضافة Paymob لاحقًا

الفكرة: في `/api/orders` لو `paymentMethod` كارت، احفظ الأوردر بـ `payment_status = 'unpaid'`، واطلب من Paymob payment key، وحوّل العميل لصفحة الدفع، وأنشئ route لـ webhook يستقبل نتيجة الدفع ويحدّث `payment_status` لـ `paid` (مع التحقق من توقيع HMAC الخاص بـ Paymob). عمود `payment_status` موجود فعلًا في الجدول.
