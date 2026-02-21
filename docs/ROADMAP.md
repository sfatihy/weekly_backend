# Project Turtle - Roadmap

Bu belge, Project Turtle projesinin genel vizyonunu, aşamalarını ve gelecekte eklenecek büyük özellikleri takip eder. Yapay zeka ajanları (AI Agents) bir sonraki hedefleri görmek için bu yolu izlemelidir.

## Aşama 1: Temel Mimari (Tamamlandı ✅)
- [x] Cloudflare D1 (SQL) veritabanı kurulumu.
- [x] Hono altyapısı ile REST API iskeletinin oluşturulması.
- [x] Repository Patern implementasyonu.
- [x] Swagger UI entegrasyonu.
- [x] Cloudflare ortamına canlı (Prod) dağıtım (Deployment).
- [x] `docs/` klasöründe AI-Driven Documentation (AIDD) yapısının kurulması.

## Aşama 2: API & Güvenlik (Sıradaki 🛠)
- [ ] API Key tabanlı basit bir kimlik doğrulama (Authentication) veya Middleware eklenmesi.
- [ ] Rotaların güvenliğini sağlama.
- [ ] Çevrimdışı (Offline) senkronizasyon mantığının tasarımı. (Flutter tarafında gönderilemeyen verilerin bulk olarak kabul edilmesi).

## Aşama 3: Gelişmiş Özellikler (Planlanıyor 🗓)
- [ ] Kullanıcılar için İstatistik/Hesaplama rotalarının (Report API) yazılması.
- [ ] Hedef bazlı (Goal Progress) grafik verisi üreten Aggregation SQL sorguları.
- [ ] Hono Validator ile gelen API verilerinin tip & şema doğrulaması (Zod).

## AI Çalışma Kuralları
* Eğer Aşama 2'ye geçmek istenirse, öncelikle `docs/features/` klasörüne o özelliğin gereksinimleri yazılmalıdır.
* Geliştirme süresince bu belge güncellenmeli ve ilerlemeler `[x]` olarak işaretlenmelidir.
