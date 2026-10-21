import { useEffect, useState } from "react"
import { deletePeminjaman, getPeminjaman, getPeminjamanById } from "../api/peminjaman"
import { getSumberDaya } from "../api/sumberDaya"
import type { Peminjaman, SumberDaya } from "../types"

type DaftarProps = {
    refreshKey: number
    sourceRefreshKey: number
    onEdit: (item: Peminjaman) => void
}

const statuses = ["aktif", "dibatalkan", "diajukan", "disetujui", "ditolak", "selesai"]
const canEditStatuses = new Set(["aktif", "diajukan", "disetujui"])

export function Daftar({ refreshKey, sourceRefreshKey, onEdit }: DaftarProps) {
    const [sumberDaya, setSumberDaya] = useState<SumberDaya[]>([])
    const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
    const [sumberDayaId, setSumberDayaId] = useState("")
    const [tanggal, setTanggal] = useState("")
    const [status, setStatus] = useState("")
    const [detail, setDetail] = useState<Peminjaman | null>(null)
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState<number | null>(null)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        let isCurrent = true
        Promise.all([
            getSumberDaya(),
            getPeminjaman({ sumber_daya_id: sumberDayaId, tanggal, status }),
        ])
            .then(([daftarSumberDaya, daftarPeminjaman]) => {
                if (!isCurrent) return
                setSumberDaya(daftarSumberDaya)
                setPeminjaman(daftarPeminjaman)
                setError(undefined)
            })
            .catch((e) => {
                if (isCurrent) setError(e instanceof Error ? e : new Error(String(e)))
            })
            .finally(() => {
                if (isCurrent) setLoading(false)
            })

        return () => {
            isCurrent = false
        }
    }, [refreshKey, sourceRefreshKey, sumberDayaId, tanggal, status])

    async function tampilkanDetail(id: number) {
        setError(undefined)
        try {
            setDetail(await getPeminjamanById(id))
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)))
        }
    }

    async function hapus(item: Peminjaman) {
        setError(undefined)
        setBusyId(item.id)
        try {
            await deletePeminjaman(item.id)
            setPeminjaman((current) => current.filter((entry) => entry.id !== item.id))
            setDetail((current) => current?.id === item.id ? null : current)
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)))
        } finally {
            setBusyId(null)
        }
    }

    return (
        <section>
            <h2>Daftar peminjaman</h2>
            <div>
                <label htmlFor="filter-sumber-daya">Filter sumber daya</label>
                <select
                    id="filter-sumber-daya"
                    value={sumberDayaId}
                    onChange={(event) => setSumberDayaId(event.target.value)}
                >
                    <option value="">Semua</option>
                    {sumberDaya.map((item) => (
                        <option key={item.id} value={item.id}>{item.nama}</option>
                    ))}
                </select>

                <label htmlFor="filter-tanggal">Filter tanggal</label>
                <input
                    id="filter-tanggal"
                    type="date"
                    value={tanggal}
                    onChange={(event) => setTanggal(event.target.value)}
                />

                <label htmlFor="filter-status">Filter status</label>
                <select id="filter-status" value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="">Semua</option>
                    {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
            </div>

            {loading && <p>Memuat peminjaman...</p>}
            {error && <p role="alert">{error.message}</p>}
            {peminjaman.length === 0 && !loading
                ? <p>Belum ada peminjaman.</p>
                : (
                    <ul aria-label="Daftar peminjaman">
                        {peminjaman.map((item) => (
                            <li key={item.id}>
                                {item.peminjam}, {item.tanggal.slice(0, 10)}, Slot {item.slot_mulai}-{item.slot_selesai}, jumlah {item.jumlah}, status {item.status}
                                {" "}
                                <button type="button" onClick={() => void tampilkanDetail(item.id)}>Detail</button>
                                {canEditStatuses.has(item.status) && (
                                    <button type="button" onClick={() => onEdit(item)}>Edit</button>
                                )}
                                <button
                                    type="button"
                                    disabled={busyId === item.id}
                                    onClick={() => void hapus(item)}
                                >
                                    {busyId === item.id ? "Menghapus..." : "Hapus"}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

            {detail && (
                <section aria-label="Detail peminjaman">
                    <h3>Detail peminjaman</h3>
                    <p>Peminjam: {detail.peminjam}</p>
                    <p>Sumber daya: {sumberDaya.find((item) => item.id === detail.sumber_daya_id)?.nama ?? detail.sumber_daya_id}</p>
                    <p>Tanggal: {detail.tanggal.slice(0, 10)}</p>
                    <p>Slot: {detail.slot_mulai}-{detail.slot_selesai}</p>
                    <p>Jumlah: {detail.jumlah}</p>
                    <p>Status: {detail.status}</p>
                </section>
            )}
        </section>
    )
}