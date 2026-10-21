import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { addPeminjaman, updatePeminjaman } from "../api/peminjaman"
import { getSumberDaya } from "../api/sumberDaya"
import type { Peminjaman, SumberDaya } from "../types"

type FormPeminjamanProps = {
    editPeminjaman: Peminjaman | null
    sourceRefreshKey: number
    onSaved: () => void
    onEditComplete: () => void
}

function isValidDate(value: string): boolean {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) return false

    const [, yearText, monthText, dayText] = match
    const year = Number(yearText)
    const month = Number(monthText)
    const day = Number(dayText)
    if (year < 1 || month < 1 || month > 12 || day < 1) return false

    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return day <= daysInMonth[month - 1]
}

export function FormPeminjaman({ editPeminjaman, sourceRefreshKey, onSaved, onEditComplete }: FormPeminjamanProps) {
    const [sumberDaya, setSumberDaya] = useState<SumberDaya[]>([])
    const [sumberDayaId, setSumberDayaId] = useState(editPeminjaman ? String(editPeminjaman.sumber_daya_id) : "")
    const [namaPeminjam, setNamaPeminjam] = useState(editPeminjaman?.peminjam ?? "")
    const [tanggal, setTanggal] = useState(editPeminjaman?.tanggal.slice(0, 10) ?? "")
    const [slotMulai, setSlotMulai] = useState(editPeminjaman?.slot_mulai ?? 1)
    const [slotSelesai, setSlotSelesai] = useState(editPeminjaman?.slot_selesai ?? 1)
    const [jumlah, setJumlah] = useState(editPeminjaman?.jumlah ?? 1)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<Error>()
    const submitting = useRef(false)

    useEffect(() => {
        getSumberDaya()
            .then((items) => {
                setSumberDaya(items)
                setError(undefined)
            })
            .catch((e) => setError(e instanceof Error ? e : new Error(String(e))))
            .finally(() => setLoading(false))
    }, [sourceRefreshKey])

    const sumberDayaTerpilih = sumberDaya.find((item) => item.id === Number(sumberDayaId))

    function resetForm() {
        setSumberDayaId("")
        setNamaPeminjam("")
        setTanggal("")
        setSlotMulai(1)
        setSlotSelesai(1)
        setJumlah(1)
        setError(undefined)
        onEditComplete()
    }

    async function simpanPeminjaman(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submitting.current) return
        setError(undefined)

        const peminjamBersih = namaPeminjam.trim()
        const sumberDayaIdAngka = Number(sumberDayaId)
        if (!peminjamBersih || peminjamBersih.length > 50) {
            setError(new Error("Nama peminjam wajib diisi dan maksimal 50 karakter setelah spasi dibuang."))
            return
        }
        if (!isValidDate(tanggal)) {
            setError(new Error("Tanggal harus merupakan tanggal kalender yang valid."))
            return
        }
        if (!Number.isInteger(slotMulai) || slotMulai < 1 || slotMulai > 8) {
            setError(new Error("Slot mulai harus berupa bilangan bulat antara 1 dan 8."))
            return
        }
        if (
            !Number.isInteger(slotSelesai)
            || slotSelesai < 1
            || slotSelesai > 8
            || slotSelesai < slotMulai
            || slotSelesai - slotMulai + 1 > 3
        ) {
            setError(new Error("Rentang slot harus berurutan, antara 1 dan 8, dan maksimal 3 slot."))
            return
        }
        if (!sumberDayaTerpilih || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > sumberDayaTerpilih.stok) {
            setError(new Error("Jumlah harus berupa bilangan bulat antara 1 dan stok sumber daya yang dipilih."))
            return
        }

        submitting.current = true
        setIsSubmitting(true)
        try {
            if (editPeminjaman) {
                await updatePeminjaman(
                    editPeminjaman.id,
                    sumberDayaIdAngka,
                    peminjamBersih,
                    tanggal,
                    slotMulai,
                    slotSelesai,
                    jumlah,
                )
            } else {
                await addPeminjaman(
                    sumberDayaIdAngka,
                    peminjamBersih,
                    tanggal,
                    slotMulai,
                    slotSelesai,
                    jumlah,
                )
            }

            onSaved()
            resetForm()
        } catch (e) {
            setError(e instanceof Error ? e : new Error(String(e)))
        } finally {
            submitting.current = false
            setIsSubmitting(false)
        }
    }

    return (
        <section>
            <h1>Form Peminjaman</h1>
            {loading && <p>Memuat sumber daya...</p>}
            <form noValidate onSubmit={simpanPeminjaman}>
                <label htmlFor="sumber-daya">Sumber daya</label>
                <select
                    id="sumber-daya"
                    name="sumber_daya_id"
                    value={sumberDayaId}
                    required
                    onChange={(event) => {
                        setSumberDayaId(event.target.value)
                        setJumlah(1)
                    }}
                >
                    <option value="">Pilih sumber daya</option>
                    {sumberDaya.map((item) => (
                        <option key={item.id} value={item.id}>{item.nama}</option>
                    ))}
                </select>

                <label htmlFor="peminjam">Peminjam</label>
                <input
                    id="peminjam"
                    name="peminjam"
                    type="text"
                    value={namaPeminjam}
                    required
                    onChange={(event) => setNamaPeminjam(event.target.value)}
                />

                <label htmlFor="tanggal">Tanggal</label>
                <input
                    id="tanggal"
                    name="tanggal"
                    type="date"
                    value={tanggal}
                    required
                    onChange={(event) => setTanggal(event.target.value)}
                />

                <label htmlFor="slot-mulai">Slot mulai</label>
                <input
                    id="slot-mulai"
                    name="slot_mulai"
                    type="number"
                    min="1"
                    max="8"
                    step="1"
                    value={slotMulai}
                    required
                    onChange={(event) => setSlotMulai(Number(event.target.value))}
                />

                <label htmlFor="slot-selesai">Slot selesai</label>
                <input
                    id="slot-selesai"
                    name="slot_selesai"
                    type="number"
                    min={slotMulai}
                    max={Math.min(8, slotMulai + 2)}
                    step="1"
                    value={slotSelesai}
                    required
                    onChange={(event) => setSlotSelesai(Number(event.target.value))}
                />

                <label htmlFor="jumlah">Jumlah</label>
                <input
                    id="jumlah"
                    name="jumlah"
                    type="number"
                    min="1"
                    max={sumberDayaTerpilih?.stok}
                    step="1"
                    value={jumlah}
                    required
                    disabled={!sumberDayaTerpilih}
                    onChange={(event) => setJumlah(Number(event.target.value))}
                />

                <button type="submit" disabled={loading || isSubmitting || sumberDaya.length === 0}>
                    {isSubmitting
                        ? "Menyimpan..."
                        : editPeminjaman ? "Simpan perubahan" : "Simpan peminjaman"}
                </button>
                {editPeminjaman && (
                    <button type="button" onClick={resetForm}>Batal ubah</button>
                )}
            </form>
            {error && <p role="alert">{error.message}</p>}
        </section>
    )
}
