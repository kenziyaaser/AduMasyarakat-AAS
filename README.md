# Sistem Pengaduan Masyarakat (Public Complaint System)

Aplikasi Sistem Pengaduan Masyarakat sederhana, responsif, dan siap pakai untuk tugas akhir. Terdiri dari Database MySQL, REST API Backend (Express.js), Dashboard Web (React), dan Aplikasi Mobile (React Native + Expo).

---

## 🛠️ Teknologi & Stack

*   **Database:** MySQL
*   **Backend:** Express.js (Node.js REST API, JWT Authentication, Multer Uploads)
*   **Web Portal:** React (Vite, Axios, Context API, Vanilla Custom CSS)
*   **Mobile App:** React Native (Expo SDK, React Navigation, AsyncStorage, Axios)

---

## ⚙️ Petunjuk Setup & Cara Menjalankan

### 1. Database (MySQL)
1. Buka MySQL server Anda (menggunakan phpMyAdmin, MySQL Workbench, atau CLI).
2. Buat database baru bernama `pengaduan_masyarakat`.
3. Import file database schema yang telah disediakan di:
   `database/schema.sql`
4. Script ini otomatis akan membuat tabel-tabel berikut beserta data demo/dummy:
   *   `users` (Masyarakat, Admin, dan Super Admin)
   *   `complaints` (Laporan pengaduan)
   *   `responses` (Tanggapan dari admin)

---

### 2. Backend REST API (Express.js)
1. Buka terminal baru dan masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Sesuaikan konfigurasi koneksi database Anda di file `.env` di dalam folder `backend`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=pengaduan_masyarakat
   JWT_SECRET=super_secret_jwt_key_123_abc_xyz_!@#
   ```
4. Jalankan server dalam mode development:
   ```bash
   npm run dev
   ```
   *Server backend akan berjalan di: `http://localhost:5000`*

---

### 3. Web Dashboard (React + Vite)
1. Buka terminal baru dan masuk ke direktori web:
   ```bash
   cd web
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Jalankan server development:
   ```bash
   npm run dev
   ```
   *Dashboard web akan terbuka di browser Anda (biasanya `http://localhost:5173`)*

---

### 4. Mobile Client (React Native + Expo)
1. Buka terminal baru dan masuk ke direktori mobile:
   ```bash
   cd mobile
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. **PENTING (Koneksi Jaringan):**
   Buka file `mobile/context/AuthContext.js` dan sesuaikan variabel `API_URL` dengan kondisi pengujian Anda:
   *   Jika menggunakan **Android Emulator**: `http://10.0.2.2:5000` (Sudah default).
   *   Jika menggunakan **iOS Simulator**: `http://localhost:5000`.
   *   Jika menggunakan **HP Fisik (Expo Go App)**: Gunakan alamat IP lokal komputer Anda (contoh: `http://192.168.1.10:5000`). *Pastikan HP dan laptop terhubung ke jaringan Wi-Fi yang sama.*
4. Jalankan Expo project:
   ```bash
   npx expo start
   ```
5. Scan QR code yang tampil di terminal menggunakan aplikasi **Expo Go** (di Android/iOS) untuk mulai menjalankan di HP Anda.

---

## 🔑 Akun Uji Coba (Demo Credentials)

Semua akun dummy menggunakan kata sandi default: **`password123`**

| Peran (Role) | Email | Deskripsi Hak Akses |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@pengaduan.go.id` | Akses penuh (Lihat laporan, tanggapan, update status, dan **menghapus laporan**). |
| **Admin Biasa** | `admin@pengaduan.go.id` | Akses petugas (Lihat laporan, tanggapan, update status, *tidak bisa menghapus laporan*). |
| **Masyarakat (User 1)** | `ahmad@example.com` | Membuat laporan baru, melacak status laporan pribadi. |
| **Masyarakat (User 2)** | `siti@example.com` | Membuat laporan baru, melacak status laporan pribadi. |

---

## 📁 Struktur Folder

```
├── database/
│   └── schema.sql                # SQL Schema & Dummy Seeds
├── backend/
│   ├── config/db.js              # Koneksi Pool MySQL
│   ├── controllers/              # Controller (Auth, Complaints, Responses)
│   ├── middleware/               # Middleware (JWT Auth & Multer Upload)
│   ├── routes/                   # Router API Endpoints
│   ├── uploads/                  # Tempat Penyimpanan Gambar Lampiran
│   ├── .env                      # Konfigurasi Backend
│   └── server.js                 # Entrypoint Utama Express
├── web/
│   ├── src/
│   │   ├── components/           # Navbar, Guard Routing Private
│   │   ├── context/AuthContext   # Global React Auth State Handler
│   │   ├── pages/                # Login, Register, User/Admin Dashboard, Form
│   │   └── index.css             # Desain Custom Premium Glassmorphic Theme
│   └── package.json
└── mobile/
    ├── context/AuthContext       # AsyncStorage & Mobile Auth Handler
    ├── screens/                  # Login, Register, List, Add, Detail
    └── App.js                    # Entrypoint Expo & React Navigation
```
