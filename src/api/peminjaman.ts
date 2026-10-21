import type { Peminjaman } from "../types";
import { ensureSuccess, request } from "./http"

const BASE_URL = "http://localhost:8080/peminjaman"

export async function getPeminjaman(filters: {
    sumber_daya_id?: string
    tanggal?: string
    status?: string
} = {}): Promise<Peminjaman[]> {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value)
    }
    const query = params.toString()
    const response = await request(query ? `${BASE_URL}?${query}` : BASE_URL)
    await ensureSuccess(response, "Gagal mengambil daftar peminjaman")
    return response.json()
}

export async function getPeminjamanById(id: number): Promise<Peminjaman> {
    const response = await request(`${BASE_URL}/${id}`)
    await ensureSuccess(response, "Gagal mengambil peminjaman")
    return response.json()
}

export async function addPeminjaman(
    sumber_daya_id: number,
    peminjam: string,
    tanggal: string,
    slot_mulai: number,
    slot_selesai: number,
    jumlah: number
): Promise<Peminjaman> {
    const response = await request(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sumber_daya_id, peminjam, tanggal, slot_mulai, slot_selesai, jumlah })
    })
    await ensureSuccess(response, "Gagal menambah peminjaman baru")
    return response.json()
}

export async function updatePeminjaman(
    id: number,
    sumber_daya_id: number,
    peminjam: string,
    tanggal: string,
    slot_mulai: number,
    slot_selesai: number,
    jumlah: number
): Promise<Peminjaman> {
    const response = await request(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sumber_daya_id, peminjam, tanggal, slot_mulai, slot_selesai, jumlah })
    })
    await ensureSuccess(response, "Gagal memperbarui peminjaman")
    return response.json()
}

export async function deletePeminjaman(id: number): Promise<void> {
    const response = await request(`${BASE_URL}/${id}`, {
        method: "DELETE"
    })
    await ensureSuccess(response, "Gagal menghapus peminjaman")
}