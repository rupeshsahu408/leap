import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { useAuth } from '../lib/auth'
import {
  type Conversation as Conv,
  type Message,
  sendMessage,
  subscribeConversation,
  subscribeMessages,
} from '../lib/messaging'
import Avatar from '../components/Avatar'
import { timeAgo } from '../lib/time'

export default function Conversation() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const [conv, setConv] = useState<Conv | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => subscribeConversation(id, setConv), [id])
  useEffect(() => subscribeMessages(id, setMessages), [id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const other = useMemo(() => {
    if (!conv || !user) return null
    const otherUid = conv.participantIds.find((p) => p !== user.uid)
    if (!otherUid) return null
    return { uid: otherUid, ...conv.participants[otherUid] }
  }, [conv, user])

  async function send() {
    if (!user || !text.trim() || sending) return
    const value = text
    setText('')
    setSending(true)
    try {
      await sendMessage(id, user.uid, value)
    } catch {
      setText(value)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] -mt-6 md:-mt-10">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[var(--color-line)] -mx-4 px-4 py-3 flex items-center gap-3">
        <Link to="/messages" className="text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="size-5" />
        </Link>
        {other && (
          <Link to={`/u/${other.uid}`} className="flex items-center gap-3 hover:underline min-w-0">
            <Avatar src={other.photoURL ?? undefined} name={other.displayName} size={36} />
            <div className="min-w-0">
              <div className="font-semibold truncate">{other.displayName}</div>
            </div>
          </Link>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center text-sm text-zinc-400 py-10">
            No messages yet. Say hi.
          </div>
        )}
        {messages.map((m, i) => {
          const mine = m.senderId === user?.uid
          const prev = messages[i - 1]
          const groupedTop = prev && prev.senderId === m.senderId
          return (
            <div
              key={m.id}
              className={`flex ${mine ? 'justify-end' : 'justify-start'} ${groupedTop ? '' : 'mt-3'}`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[15px] leading-snug ${
                  mine
                    ? 'bg-brand-500 text-white rounded-br-md'
                    : 'bg-white text-zinc-900 border border-[var(--color-line)] rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                <div className={`text-[10px] mt-1 ${mine ? 'text-brand-100' : 'text-zinc-400'}`}>
                  {timeAgo(m.createdAt)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 bg-[var(--color-bg)] pt-2 pb-2 -mx-4 px-4 border-t border-[var(--color-line)]">
        <div className="flex gap-2 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-sm outline-none focus:border-brand-500 max-h-32"
            maxLength={2000}
          />
          <button
            onClick={send}
            disabled={!text.trim() || sending}
            className="size-11 grid place-items-center rounded-full bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40"
          >
            <Send className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
