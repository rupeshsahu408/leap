import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { createStartup, type StartupInput } from '../lib/startups'
import StartupForm from '../components/StartupForm'

export default function StartupNew() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(data: StartupInput) {
    if (!user) return
    const id = await createStartup(data, user.uid)
    navigate(`/startups/${id}`, { replace: true })
  }

  return (
    <div className="space-y-5">
      <Link to="/startups" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="size-4" /> Back to ventures
      </Link>
      <div>
        <h1 className="font-display text-2xl">Create a venture</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Tell other founders what you're building. You can edit anything later.
        </p>
      </div>
      <StartupForm
        submitLabel="Create venture"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/startups')}
      />
    </div>
  )
}
