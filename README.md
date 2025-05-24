## Proje Hakkında

Bu sistem, kullanıcıların hesap oluşturarak giriş yapabilmesini, ardından kişisel klasörlerine dosya yükleyip, yükledikleri dosyaları listeleyip silebilmesini sağlar. 

- Kullanıcılar JWT (JSON Web Token) ile kimlik doğrulanır.
- Dosyalar kullanıcı bazında ayrı klasörlerde saklanır.
- Aynı isimde dosya yüklenmesi engellenir.
- Dosya yükleme, listeleme ve silme işlemleri güvenli bir şekilde yapılır.
- Kullanıcı giriş yaptıktan sonra "Hoş geldin, [kullanıcı adı]" şeklinde kişiselleştirilmiş bir karşılama mesajı gösterilir.
-Çıkış yapıldığında kullanıcı tekrar giriş sayfası olan index.html sayfasına yönlendirilir.

## Kurulum

### 1. Projeyi Klonlama

```bash
git clone https://github.com/nur-ay04/dosya_yonetimi_sistemi.git
```
### 2. Proje Dizinine Geçiş
```bash
cd dosya_yonetimi_sistemi
```
### 3. Gerekli Node.js Paketlerini Yükleyin

```bash
npm install
```
### 4. .env Dosyasını Proje Ana Dizinine Oluşturun ve İçinde Şu Satırı Ekleyin:
```bash
JWT_SECRET=gizli_anahtar123
```
### 5. Sunucuyu başlatma
```bash
npm start
```

## Kullanım
###  Tarayıcıda erişim
Ana sayfa: http://localhost:3000/index.html

###  Kayıt ve Giriş
- Ana sayfadan yeni kullanıcı kaydı oluşturabilirsiniz.
- Giriş yaptıktan sonra size JWT token verilir.
- Bu token ile dosya yükleme, listeleme ve silme işlemlerini yapabilirsiniz.


### Dosya İşlemleri
- Yüklenen dosyalar kullanıcıya özel uploads/{kullanici_adi}/ klasöründe saklanır.
- Aynı dosya adıyla tekrar yükleme engellenir.
- Yüklenen dosyaları listeleyebilir ve silebilirsiniz.


## Teknik Detaylar
- Backend: Node.js, Express.js
- Kimlik Doğrulama: JSON Web Token (JWT)
- Şifreleme: bcryptjs ile parola hashleme
- Dosya Yükleme: multer ile kullanıcıya özel klasörlerde
- Veri Depolama: users.json ve files.json dosyalarında kullanıcı ve dosya bilgileri
- Frontend: HTML, CSS ve JavaScript kullanılarak kullanıcı arayüzü oluşturulmuştur.
## Notlar
- JWT token süresi 1 saattir. Süre dolunca tekrar giriş yapmanız gerekir.
- Dosya yüklerken aynı isimde dosya varsa hata döner.
