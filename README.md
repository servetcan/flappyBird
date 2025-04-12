📜 Oyun Hakkında
Bu proje, klasik Flappy Bird oyununun basit bir JavaScript uyarlamasıdır. Canvas ve JavaScript kullanılarak geliştirilmiştir.

🎮 Oyunun Amacı
Kuşu borular arasından geçirerek mümkün olduğunca uzağa gitmeye çalışın. Her boru çiftini geçtiğinizde puan kazanırsınız.

🕹️ Oynanış
Başlatma: Oyunu başlatmak için herhangi bir tuşa basın, ekrana tıklayın veya dokunun.

Kontrol: Kuşu zıplatmak için herhangi bir tuşa basın, ekrana tıklayın veya dokunun.

Amaç: Kuşu borulara çarptırmadan uçurmak ve mümkün olduğunca çok boru geçerek yüksek puan almak.

📂 Dosya Yapısı
Copy
flappy-game/
├── index.html      # Ana HTML dosyası
├── script.js       # Oyun mantığı ve işlevleri
└── styles.css      # Oyunun stil dosyası

✨ Özellikler
Responsive tasarım (farklı ekran boyutlarına uyumlu)

Yüksek puan takibi

Basit ve sezgisel kontrol

Çarpışma algılama

Oyun sonu ekranı

🖼️ Ekran Görüntüleri
Başlangıç Ekranı: "Başlamak için herhangi bir yere basınız" mesajı
![Oyun Görüntüsü](screenshot.png)
Oyun Ekranı: Kuş borular arasında uçuyor
![Oyun Görüntüsü](screenshot.png)
Oyun Sonu: "Başaramadık Abi :(" ve skor gösterimi
![Oyun Görüntüsü](screenshot.png)

🏗️ Kod Yapısı ve Mimari Açıklaması
# Flappy Bird Oyunu Kod Yapısı

## 🎯 Temel Yapı
Oyun üç ana dosyadan oluşur:
1. `index.html` - Oyunun HTML iskeleti
2. `styles.css` - Görsel stiller
3. `script.js` - Oyun mantığı

## 📜 script.js Detaylı Açıklama

### 1. Oyun Değişkenleri ve Ayarlar
```javascript
var myCanvas = document.getElementById('myCanvas');
var ctx = myCanvas.getContext("2d");
var FPS = 40; // Saniyedeki kare sayısı
var jump_amount = -10; // Zıplama yüksekliği
// Diğer fizik ayarları...

2. Sprite Sistemi

function MySprite(img_url) {
  this.x = 0; // X pozisyonu
  this.y = 0; // Y pozisyonu
  this.velocity_x = 0; // X hızı
  // Diğer sprite özellikleri...
}

MySprite.prototype.Do_Frame_Things = function() {
  // Sprite'ı çizme ve konum güncelleme
};

3. Oyun Mekaniği

// Çarpışma kontrolü
function ImagesTouching(thing1, thing2) { ... }

// Kuş hareketleri
function make_bird_slow_and_fall() { ... }

// Boru oluşturma
function add_pipe(x_pos, top_of_gap, gap_width) { ... }

4. Oyun Döngüsü

function Do_a_Frame() {
  // 1. Temizleme
  // 2. Arkaplan çiz
  // 3. Oyun durumuna göre işlemler:
  //    - Başlangıç ekranı
  //    - Oyun içi
  //    - Oyun sonu
}


5. Olay Yönetimi

// Kullanıcı girişleri
function Got_Player_Input(MyEvent) { ... }

// Pencere boyut değişiklikleri
function resizeCanvas() { ... }
