# Local Test ve Yapay Zeka Dökümantasyon (Artifact) Planı

## Amaç
Bu planda, iki hedefimiz var:
1. Geliştirme sürecine dahil olmadan (Deploy işlemi olmadan) yerelde sistemi nasıl test edebileceğimizi belirlemek.
2. Senin yapay zeka asistanının oluşturduğu "brain" (Artifact / Bellek) dosyalarını, senden sonra gelecek insanların veya yapay zekaların da projeyi anlayıp kaldığı yerden sağlıklı devam ettirebilmesi için doğrudan GitHub (Proje) dizinine taşımak.

## Önerilen Değişiklikler

### 1. Artifact'ların Projeye Özel Olarak Kaydedilmesi
Şu an yapay zeka araçları projeleri anlamak için projenin dışında gizli klasörlerde (`.gemini/antigravity/...` gibi) çalışır. Biz bu bilgiyi projenin içine aktaracağız:

*   Projenin kök dizininde `.ai/` veya `.cursorrules` ya da direkt `docs/ai_artifacts/` adında bir klasör oluşturulacak.
*   Şu ana kadar yarattığım `task.md` (Görev listesi), `implementation_plan.md` gibi hafıza/planlama dosyalarını bu klasöre kopyalayacağım.
*   Ayrıca **"Proje Hakkında AI'ın Bilmesi Gerekenler"** ana temalı bir `AI_CONTEXT.md` dosyası oluşturacağım. Senden sonra başka biri projeyi fork ettiğinde veya başka bir AI'a sorduğunda, o AI bu dosyayı okuyarak: "Hımm, bu proje Flutter/Hive destekli, Cloudflare D1 veritabanı ile yazılmış, Hono altyapılı ve Repository patern kullanan bir uygulamadır." diye anında tüm mimariyi hatırlayacaktır.

### 2. Sürekli Yerel Test (Local Test) Ortamı
Bundan sonra kodlara her dokunduğumuzda (refactor vb. sonrası) kesinlikle "Deploy" *yapmadan önce* Local Test yapacağız.
Bunun için adımlar:
*   Local D1 Veritabanımız zaten `npx wrangler d1 execute turtle-db --local --file=./schema.sql` komutuyla ayakta duruyor.
*   Biz `npm run dev` komutunu başlattığımızda API `http://localhost:8787` de ayağa kalkar.
*   Swagger testlerini (`http://localhost:8787/ui`) production değil, doğrudan bu **local** ortam üzerinden yaparak önce sorun olmadığından emin olacağız. Sonra Deploy edeceğiz.

## Doğrulama
Bu değişiklikler tamamlandığında projenin klasör hiyerarşisinde `docs/` veya `ai_artifacts/` adlı klasörlerin içine girildiğinde, sistemin tüm geçmiş kararlarının okunaklı markdown formunda bulunduğu teyit edilecek.
