import type { SumberDaya } from "../types"
import { ensureSuccess, request } from "./http"

const BASE_URL = "http://localhost:8080/sumber-daya"

export async function getSumberDaya(): Promise<SumberDaya[]> {
    const response = await request(BASE_URL)
    await ensureSuccess(response, "Gagal mengambil daftar sumber daya")
    return response.json()
}

export async function getSumberDayaById(id: number): Promise<SumberDaya> {
    const response = await request(`${BASE_URL}/${id}`)
    await ensureSuccess(response, "Gagal mengambil sumber daya")
    return response.json()
}

export async function addSumberDaya(nama: string, jenis: string, stok: number): Promise<SumberDaya> {
    const response = await request(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, jenis, stok })
    })
    await ensureSuccess(response, "Gagal menambah sumber daya baru")
    return response.json()
}