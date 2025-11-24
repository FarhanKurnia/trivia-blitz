# 🧠 CLASH OF MINDS - TRIVIA BLITZ ⚡

Aplikasi web trivia interaktif yang dirancang untuk acara **BSI Day 2025** dengan fokus pada kecepatan, ketepatan, dan tampilan yang modern dan responsif.

---

## 🚀 Ikhtisar Fitur Utama

Proyek ini dibangun menggunakan HTML, CSS, dan JavaScript murni, tanpa *framework* eksternal, untuk memastikan kinerja cepat dan kemudahan implementasi.

* **Navigasi Halaman Penuh:** Transisi halus antara 4 halaman utama (Cover, Rules, Game, Finish).
* **Data Eksternal (JSON):** Data soal (`questions.json`) dan peraturan (`rules.json`) dimuat secara asinkron, memudahkan *update* konten tanpa mengubah logika inti JavaScript.
* **Timer Interaktif:** Timer mundur 20 detik dengan indikator visual (bar) dan efek peringatan waktu habis.
* **Game Loop Penuh:** Siklus permainan yang lengkap, dari *start* hingga halaman akhir (`Finish Page`), dengan tombol **"MULAI ULANG"** untuk me-reset permainan.
* **Desain Responsif:** Tampilan dioptimalkan untuk berbagai perangkat, dari layar *desktop* lebar hingga ponsel (*mobile*) dan *tablet*.

---

## 📋 Struktur Proyek
Tentu, berikut adalah draf untuk file README.md Anda, disajikan dalam format Markdown standar. Ini mencakup semua fitur utama yang telah kita kembangkan (halaman, timer, responsif, dan data eksternal JSON).
```
. ├── assets/ │ 
  │  ├── css/ │ 
  │  │ └── style.css # Styling utama dan media queries │ 
  │  ├── js/ │ 
  │  │ └── script.js # Logika game (game state, timer, navigasi) │ 
  │  ├── json/ │ 
  │  │ ├── questions.json # Sumber data soal trivia │ 
  │  │ └── rules.json # Sumber data peraturan game │ 
  │  └── img/ # Folder untuk semua gambar background dan aset │ 
  │      ├── background1.jpg # Contoh: Background Cover Page (Koloseum) │ 
  │      └── ... 
  └── index.html # Struktur HTML utama (4 halaman game) 
  └── README.md
```
---

## 🖥️ Cara Menjalankan

1.  **Kloning Repositori:** Unduh atau *clone* seluruh folder proyek.
2.  **Server Lokal:** Karena game memuat data dari file JSON, Anda **harus** menjalankan proyek melalui server lokal (misalnya, menggunakan ekstensi **"Live Server"** di Visual Studio Code, atau melalui XAMPP/WAMP).
3.  **Buka Browser:** Buka `index.html` melalui URL server lokal Anda (misalnya: `http://127.0.0.1:5500/index.html`).

---

## ⚙️ Konfigurasi dan Kustomisasi

### 1. Mengubah Soal

Untuk mengubah atau menambah soal, edit file:

* `assets/data/questions.json`

### 2. Mengubah Waktu Timer

Untuk mengubah batas waktu per soal, modifikasi konstanta di `assets/js/script.js`:

```javascript
// assets/js/script.js
const INITIAL_TIME = 20; // Ubah nilai ini (dalam detik)
```

### 3. Mengubah Peraturan
Untuk memperbarui daftar peraturan, edit file:
```
assets/data/rules.json
```
### 4. Penyesuaian Tampilan Responsif
Jika Anda perlu melakukan penyesuaian tata letak untuk ukuran layar tertentu, modifikasi bagian @media queries di akhir file assets/css/style.css.

## 🤝 Kontribusi
Proyek ini terbuka untuk penyesuaian. Jika Anda menemukan bug atau memiliki saran perbaikan, silakan modifikasi dan implementasikan perubahan.

Dibuat untuk BSI Day 2025 - Smart Battle: Clash of Minds