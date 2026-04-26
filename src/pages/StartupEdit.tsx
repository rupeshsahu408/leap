import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  deleteStartup,
  fetchStartup,
  updateStartup,
  type Startup,
  type StartupInput,
} from '../lib/startups'
import StartupForm from '../components/StartupForm'

export default function StartupEdit() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<Startup | null | undefined>(undefined)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    fetchStartup(id).then(setData)
  }, [id])

  if (data === undefined) return <div className="text-sm text-zinc-500">Loading…</div>
  if (data === null) return (
    <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center text-zinc-500">
      Venture not found.
    </div>
  )
  if (user?.uid !== data.ownerId) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center text-zinc-500">
        Only the owner can edit this venture.
      </div>
    )
  }

  async function handleSubmit(patch: StartupInput) {
    await updateStartup(id, patch)
    navigate(`/startups/${id}`)
  }

  async function handleDelete() {
    await deleteStartup(id)
    navigate('/startups', { replace: true })
  }

  return (
    <div className="space-y-5">
      <Link to={`/startups/${id}`} className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="size-4" /> Back to venture
      </Link>
      <div>
        <h1 className="font-display text-2xl">Edit venture</h1>
        <p className="text-sm text-zinc-500 mt-1">Update your startup's details.</p>
      </div>

      <StartupForm
        initial={data}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/startups/${id}`)}
      />

      <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5">
        <h3 className="font-semibold text-red-700">Danger zone</h3>
        <p className="text-sm text-red-600/80 mt-1">
          Permanently delete this venture. This can't be undone.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-red-300 text-red-700 bg-white hover:bg-red-100"
          >
            <Trash2 className="size-3.5" /> Delete venture
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-full text-sm bg-red-600 text-white hover:bg-red-700"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-full text-sm bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
