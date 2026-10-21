import { useEffect, useState } from "react"
import type { SumberDaya } from "../types"
import { addSumberDaya, getSumberDaya } from "../api/sumberDaya"

type SumberDayaProps = {
    onCreated: () => void
}

export function SumberDaya({ onCreated }: SumberDayaProps) {
    const [nama, setNama] = useState<string>("")
    const [jenis, setJenis] = useState<string>("")
    const [stok, setStok] = useState<number>(1)
    const [sumberDaya, setSumberDaya] = useState<SumberDaya[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        getSumberDaya()
            .then((v) => setSumberDaya(v))
            .catch((e) => setError(e))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            {loading && <p>Memuat data sumber daya...</p>}
            <form onSubmit={ async (e) => {
                e.preventDefault()
                setError(undefined)
                try {
                    const baru = await addSumberDaya(nama, jenis, stok)
                    setSumberDaya((current) => [...current, baru])
                    onCreated()
                } catch (e) {
                    setError(e instanceof Error ? e : new Error(String(e)))
                }
            }}>
                <label htmlFor="nama">Nama sumber daya</label>
                <input id="nama" name="nama" type="text" value={nama} required onChange={(e) => setNama(e.target.value)} />

                <label htmlFor="jenis">Jenis</label>
                <select id="jenis" name="jenis" value={jenis} required onChange={(e) => setJenis(e.target.value)}>
                    <option value="" disabled>Pilih jenis</option>
                    <option value="ruang">Ruang</option>
                    <option value="alat">Alat</option>
                </select>

                <label htmlFor="stok">Stok</label>
                <input id="stok" name="stok" type="number" min="1" value={stok} required onChange={(e) => setStok(Number(e.target.value))}/>

                <button type="submit">Simpan sumber daya</button>
            </form>
            {error && <p role="alert">{error.message}</p>}
            <ul aria-label="Daftar sumber daya">
                { sumberDaya.map((sd) => (
                    <li key={sd.id}>Nama: { sd.nama }, Jenis: { sd.jenis }, Stok: { sd.stok }</li>
                )) }
            </ul>
        </div>
    )
}