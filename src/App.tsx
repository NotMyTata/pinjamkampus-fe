import { useState } from 'react'
import './App.css'
import { SumberDaya } from './components/SumberDaya'
import { FormPeminjaman } from './components/FormPeminjaman'
import { Daftar } from './components/Daftar'
import type { Peminjaman } from './types'

function App() {
  const [editPeminjaman, setEditPeminjaman] = useState<Peminjaman | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [sourceRefreshKey, setSourceRefreshKey] = useState(0)

  return (
    <>
      <FormPeminjaman
        key={editPeminjaman?.id ?? 'baru'}
        editPeminjaman={editPeminjaman}
        sourceRefreshKey={sourceRefreshKey}
        onSaved={() => setRefreshKey((key) => key + 1)}
        onEditComplete={() => setEditPeminjaman(null)}
      />
      <Daftar refreshKey={refreshKey} sourceRefreshKey={sourceRefreshKey} onEdit={setEditPeminjaman} />
      <SumberDaya onCreated={() => setSourceRefreshKey((key) => key + 1)} />
    </>
  )
}

export default App
