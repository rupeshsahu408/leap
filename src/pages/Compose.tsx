import { useNavigate } from 'react-router-dom'
import PostComposer from '../components/PostComposer'

export default function Compose() {
  const navigate = useNavigate()
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Share something</h1>
      <p className="text-zinc-500 text-sm -mt-2">
        Post an update, ask a question, or share what you're building. Use #hashtags so others can discover it.
      </p>
      <PostComposer
        autoFocus
        variant="card"
        onPosted={() => navigate('/', { replace: true })}
      />
    </div>
  )
}
