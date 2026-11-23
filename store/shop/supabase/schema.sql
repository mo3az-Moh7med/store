-- شغّل الملف ده مرة واحدة في Supabase: SQL Editor > New query > الصق > Run

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_no       bigint generated always as identity (start with 1001),
  created_at     timestamptz not null default now(),

  -- حالة الأوردر: بتغيّرها بإيدك من Table Editor
  status         text not null default 'new'
                 check (status in ('new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),

  customer_name  text not null,
  phone          text not null,
  governorate    text not null,
  city           text not null,
  address        text not null,
  notes          text,

  -- الأصناف وقت الطلب (اسم، مقاس، لون، كمية، سعر الوحدة)
  items          jsonb not null,
  subtotal       integer not null,
  shipping       integer not null,
  total          integer not null,

  payment_method text not null default 'cod',
  payment_status text not null default 'unpaid'   -- هتفيدك لما تضيف Paymob
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- أمان: نفعّل RLS من غير أي policy، يعني محدش يقدر يقرا أو يكتب بالمفتاح العام (anon).
-- الموقع بيكتب بالـ service_role من السيرفر بس (بيتخطى RLS)، وانت بتشوف الأوردرات من لوحة Supabase.
alter table public.orders enable row level security;
