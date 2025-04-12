// Canvas ve oyun ayarlarımız
var myCanvas = document.getElementById('myCanvas');
var ctx = myCanvas.getContext("2d");
var FPS = 40;
var jump_amount = -10;
var max_fall_speed = +10;
var acceleration = 1;
var pipe_speed = -2;
var game_mode = "prestart";
var time_game_last_running;
var bottom_bar_offset = 0;
var pipes = [];
var assetsLoaded = 0;
var totalAssets = 3; // Toplam yüklenecek resim sayısı

// Sprite sınıfı
function MySprite(img_url) {
  this.x = 0;
  this.y = 0;
  this.visible = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.MyImg = new Image();
  this.MyImg.src = img_url || "";
  this.angle = 0;
  this.flipV = false;
  this.flipH = false;
}

MySprite.prototype.Do_Frame_Things = function () {
  if (!this.MyImg.complete) return; // Resim yüklenmemişse çizme
  
  ctx.save();
  ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
  ctx.rotate((this.angle * Math.PI) / 180);
  if (this.flipV) ctx.scale(1, -1);
  if (this.flipH) ctx.scale(-1, 1);
  if (this.visible)
    ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
  this.x = this.x + this.velocity_x;
  this.y = this.y + this.velocity_y;
  ctx.restore();
};

// Çarpışma kontrolü
function ImagesTouching(thing1, thing2) {
  if (!thing1.visible || !thing2.visible) return false;
  if (!thing1.MyImg.complete || !thing2.MyImg.complete) return false; // Resimler yüklenmemişse çarpışma yok
  
  if (
    thing1.x >= thing2.x + thing2.MyImg.width ||
    thing1.x + thing1.MyImg.width <= thing2.x
  )
    return false;
  if (
    thing1.y >= thing2.y + thing2.MyImg.height ||
    thing1.y + thing1.MyImg.height <= thing2.y
  )
    return false;
  return true;
}

// Kullanıcı girişi
function Got_Player_Input(MyEvent) {
  switch (game_mode) {
    case "prestart": {
      game_mode = "running";
      break;
    }
    case "running": {
      bird.velocity_y = jump_amount;
      break;
    }
    case "over":
      if (new Date() - time_game_last_running > 1000) {
        reset_game();
        game_mode = "running";
        break;
      }
  }
  MyEvent.preventDefault();
}

// Kuş hareketleri
function make_bird_slow_and_fall() {
  if (bird.velocity_y < max_fall_speed) {
    bird.velocity_y = bird.velocity_y + acceleration;
  }
  if (bird.y > myCanvas.height - bird.MyImg.height) {
    bird.velocity_y = 0;
    game_mode = "over";
  }
  if (bird.y < 0 - bird.MyImg.height) {
    bird.velocity_y = 0;
    game_mode = "over";
  }
}

// Boru oluşturma
function add_pipe(x_pos, top_of_gap, gap_width) {
  if (!pipe_piece.complete) return; // Boru resmi yüklenmemişse ekleme
  
  var top_pipe = new MySprite();
  top_pipe.MyImg = pipe_piece;
  top_pipe.x = x_pos;
  top_pipe.y = top_of_gap - pipe_piece.height;
  top_pipe.velocity_x = pipe_speed;
  pipes.push(top_pipe);
  
  var bottom_pipe = new MySprite();
  bottom_pipe.MyImg = pipe_piece;
  bottom_pipe.flipV = true;
  bottom_pipe.x = x_pos;
  bottom_pipe.y = top_of_gap + gap_width;
  bottom_pipe.velocity_x = pipe_speed;
  pipes.push(bottom_pipe);
}

// Kuş eğimi
function make_bird_tilt_appropriately() {
  if (bird.velocity_y < 0) {
    bird.angle = -15;
  } else if (bird.angle < 70) {
    bird.angle = bird.angle + 4;
  }
}

// Boruları gösterme
function show_the_pipes() {
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].Do_Frame_Things();
  }
}

// Oyun bitiş kontrolü
function check_for_end_game() {
  for (var i = 0; i < pipes.length; i++)
    if (ImagesTouching(bird, pipes[i])) game_mode = "over";
}

// Başlangıç talimatları
function display_intro_instructions() {
  ctx.font = "25px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    "Başlamak için herhangi bir yere basınız",
    myCanvas.width / 2,
    myCanvas.height / 4
  );
}

// Oyun sonu ekranı
function display_game_over() {
  var score = 0;
  for (var i = 0; i < pipes.length; i++)
    if (pipes[i].x < bird.x) score = score + 0.5;
  
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Başaramadık Abi :(", myCanvas.width / 2, 100);
  ctx.fillText("Skor: " + Math.floor(score), myCanvas.width / 2, 150);
  ctx.font = "20px Arial";
  ctx.fillText("YİNE YİNE YENİDEN DENE", myCanvas.width / 2, 300);
}

// Alt çubuk
function display_bar_running_along_bottom() {
  if (!bottom_bar.complete) return; // Taban çubuğu yüklenmemişse çizme
  
  // Taban çubuğunu tekrarlayarak çiz
  var barWidth = bottom_bar.width;
  var totalWidth = myCanvas.width + barWidth;
  
  for (var x = bottom_bar_offset; x < totalWidth; x += barWidth) {
    ctx.drawImage(
      bottom_bar,
      x,
      myCanvas.height - bottom_bar.height
    );
  }
  
  bottom_bar_offset -= 2; // Kaydırma hızı
  if (bottom_bar_offset <= -barWidth) bottom_bar_offset = 0;
}

// Oyunu sıfırlama
function reset_game() {
  bird.y = myCanvas.height / 2;
  bird.angle = 0;
  bird.velocity_y = 0;
  pipes = [];
  add_all_my_pipes();
}

// Tüm boruları ekleme
function add_all_my_pipes() {
  if (!pipe_piece.complete) return; // Boru resmi yüklenmemişse bekleme
  
  add_pipe(500, 100, 140);
  add_pipe(800, 50, 140);
  add_pipe(1000, 250, 140);
  add_pipe(1200, 150, 120);
  add_pipe(1600, 100, 120);
  add_pipe(1800, 150, 120);
  add_pipe(2000, 200, 120);
  add_pipe(2200, 250, 120);
  add_pipe(2400, 30, 100);
  add_pipe(2700, 300, 100);
  add_pipe(3000, 100, 80);
  add_pipe(3300, 250, 80);
  add_pipe(3600, 50, 60);
  
  var finish_line = new MySprite("https://s2js.com/img/etc/flappyend.png");
  finish_line.x = 3900;
  finish_line.velocity_x = pipe_speed;
  pipes.push(finish_line);
}

// Resim yükleme işleyici
function handleAssetLoad() {
  assetsLoaded++;
  if (assetsLoaded >= totalAssets) {
    // Tüm resimler yüklendi, oyunu başlat
    resizeCanvas();
    bird.x = myCanvas.width / 3;
    bird.y = myCanvas.height / 2;
    add_all_my_pipes();
    setInterval(Do_a_Frame, 1000 / FPS);
  }
}

// Ana oyun döngüsü
function Do_a_Frame() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  
  // Arkaplan resmini çiz
  drawBackground();
  
  bird.Do_Frame_Things();
  display_bar_running_along_bottom();
  
  switch (game_mode) {
    case "prestart": {
      display_intro_instructions();
      break;
    }
    case "running": {
      time_game_last_running = new Date();
      show_the_pipes();
      make_bird_tilt_appropriately();
      make_bird_slow_and_fall();
      check_for_end_game();
      break;
    }
    case "over": {
      make_bird_slow_and_fall();
      display_game_over();
      break;
    }
  }
}

// Arkaplan çiz
function drawBackground() {
  if (background_img.complete) {
    ctx.drawImage(background_img, 0, 0, myCanvas.width, myCanvas.height);
  } else {
    // Arkaplan yüklenmemişse düz mavi renk kullan
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  }
}

// Canvas boyutlandırma
function resizeCanvas() {
  var container = document.getElementById('game-container');
  var canvas = document.getElementById('myCanvas');
  
  // Oyunun orijinal en-boy oranı (620x480 ~ 1.29)
  var originalRatio = 620 / 480;
  
  // Container boyutları
  var containerWidth = container.clientWidth;
  var containerHeight = container.clientHeight;
  var containerRatio = containerWidth / containerHeight;
  
  // Oranlara göre yeni boyutları belirle
  if (containerRatio > originalRatio) {
    // Geniş ekran - yüksekliğe göre ölçekle
    canvas.width = containerHeight * originalRatio;
    canvas.height = containerHeight;
  } else {
    // Dar ekran - genişliğe göre ölçekle
    canvas.width = containerWidth;
    canvas.height = containerWidth / originalRatio;
  }
  
  // Canvas CSS boyutlarını ayarla
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  
  // Oyun mekanikleri için orijinal boyutları koru
  ctx = canvas.getContext("2d");
  
  // Kuşun konumunu yeniden ayarla
  if (typeof bird !== 'undefined') {
    bird.x = canvas.width / 3;
    bird.y = canvas.height / 2;
  }
  
  // Boruları yeniden oluştur
  pipes = [];
  add_all_my_pipes();
}

// Resim yüklemeleri
var pipe_piece = new Image();
pipe_piece.onload = handleAssetLoad;
pipe_piece.src = "https://s2js.com/img/etc/flappypipe.png";

var bottom_bar = new Image();
bottom_bar.onload = handleAssetLoad;
bottom_bar.src = "https://s2js.com/img/etc/flappybottom.png";

// Arkaplan resmi
var background_img = new Image();
background_img.onload = handleAssetLoad;
background_img.src = "https://i.ibb.co/jkMYz1hj/gecebg.png";

// Kuş oluşturma
var bird = new MySprite("https://s2js.com/img/etc/flappybird.png");

// Olay dinleyicileri
addEventListener("touchstart", Got_Player_Input);
addEventListener("mousedown", Got_Player_Input);
addEventListener("keydown", Got_Player_Input);
window.addEventListener('resize', resizeCanvas);

// Sayfa yüklendiğinde başlat
window.addEventListener('load', function() {
  // Resim yüklemeleri başlatıldı, yüklenme tamamlandığında oyun başlayacak
});