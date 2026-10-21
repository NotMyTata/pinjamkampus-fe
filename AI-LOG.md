# AI-LOG

Catat setiap penggunaan AI yang menghasilkan kode. Jika tidak memakai AI sama sekali, tulis satu baris: **tidak memakai AI**.

Log yang jujur tidak mengurangi nilai, sebanyak apa pun AI dipakai. Yang mengurangi nilai adalah log yang tidak sesuai dengan kode, atau isi log yang tidak bisa kamu jelaskan.

## (Nama fitur atau komponen, misalnya: Penanganan error 409 di form peminjaman, F5)
- Prompt: (ringkas, apa yang kamu minta)
- Dipakai: (bagian kode yang kamu ambil, misalnya nama komponen/fungsi dan file)
- Diubah: (apa yang kamu ubah atau perbaiki dari hasil AI, dan kenapa)

## (Entri berikutnya)
- Prompt: tolong perbaiki dan sesuaikan dengan konteks requirement ini **seluruh dokumen requirement**
- Dipakai: bagian App.tsx, FormPeminjaman (diubah), Daftar, Api (perubahan)
- Diubah: bagian App.tsx, FormPeminjaman (diubah), Daftar, Api (perubahan)

## Form peminjaman
- Prompt: Sesuaikan halaman dengan aturan peminjaman dan dukung perubahan data.
- Dipakai: `src/components/FormPeminjaman.tsx` untuk form dan validasi; `src/components/Daftar.tsx` untuk filter, detail, edit, dan hapus; `src/api/http.ts`, `src/api/peminjaman.ts`, dan `src/api/sumberDaya.ts` untuk kontrak API; `src/App.tsx` untuk menghubungkan komponen.
- Diubah: Tanggal dikirim sebagai `YYYY-MM-DD`, pesan error API ditampilkan, dan daftar dimuat ulang setelah perubahan sukses. Validasi tanggal kalender, nama setelah trim, maksimal 3 slot untuk persona B, serta jumlah terhadap stok dilakukan sebelum pengiriman.
