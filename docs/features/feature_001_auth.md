# Feature: Simple Authentication API Key
**Status:** Pending (Gelecekte Yapılacak)
**Created:** 2026-02-21

## Gerekçe (Why?)
Şu anda API tamamen açık. Flutter uygulaması dışındaki herhangi biri endpoint'i bulup D1 veritabanımıza sahte görevler yazabilir. Basit bir güvenlik duvarına (Middleware) ihtiyacımız var.

## Kapsam (What?)
1. Hono'da global bir middleware (veya özel bir middleware fonksiyonu) yazılarak gelen isteklerin `Authorization` başlığı kontrol edilecek.
2. Basit bir `API_KEY` mekanizması kurulacak (örneğin Wrangler Secret veya `wrangler.jsonc` üzerinden çekilen bir sabit şifre).
3. Hatalı olanlara `401 Unauthorized` dönülecek.
4. (Opsiyonel): `users` tablosuna auth ile ilgili alan eklenebilir veya Firebase tarzı token id doğrulaması yapılabilir.

## AI Geliştirme Yönergesi
Eğer bu göreve "başlaman" istenirse:
1. Bu belgeyi oku.
2. Kendin için bir `task.md` yarat.
3. Kodu implemente et ve test et.
4. Bu belgeyi `features/` altından silip `changelog/` altına (örn: `003_auth_middleware.md`) taşı.
