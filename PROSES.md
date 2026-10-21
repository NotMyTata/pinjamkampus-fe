# PROSES

## 1. Persona dan masalahnya
Pengguna berasal Mahasiswa yang ingin meminjam alat, masalah yang ingin diselesaikan adalah peminjaman yang tidak teratur dimana ada yang tidak kebagian, fitur yang diajukan adalah membuat batasan slot dalam meminjam alat dan memberikan informarsi terkait ketersediaannya.

## 2. Rancangan komponen dan state
SumberDaya -> Menyimpan state pada setiap input form untuk kebutuhan addSumberDaya, beserta daftar sumber daya
FormPeminjaman -> Menyimpan state pada setiap input form untuk kebutuhan add, update, delete peminjaman dan daftar


## 3. Satu keputusan desain
Reusable, untuk menghemat, mempermudah, menyederhana pengembangan dan maintenence kode.

## 4. Bug atau kendala (minimal dua)
### Bug 1
- Gejala: Error ketika add sumber daya
- Cara menemukan: Membaca line kode dan dokumentasi
- Penyebab dan solusi: Pada option, value belum ditentukan sehingga kosong dan error ketika submit

### Bug 2
- Gejala: Error ketika add peminjaman
- Cara menemukan: Membaca line kode dan dokumen
- Penyebab dan solusi: Meminta AI untuk memperbaiki bug

## 5. Change request
(Apa yang diminta, bagian kode mana yang kamu ubah, dan satu keputusan desain yang kamu ambil.)
