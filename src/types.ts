export type SumberDaya = {
    id: number;
    nama: string;
    jenis: string;
    stok: number
}

export type Peminjaman = {
    id: number;
    sumber_daya_id: number;
    peminjam: string;
    tanggal: string;
    slot_mulai: number;
    slot_selesai: number;
    jumlah: number;
    status: string;
}