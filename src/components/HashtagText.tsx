import { Link } from 'react-router-dom'

export default function HashtagText({ text }: { text: string }) {
  const parts = splitWithHashtags(text)
  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((p, i) =>
        p.type === 'tag' ? (
          <Link
            key={i}
            to={`/tag/${p.value.toLowerCase()}`}
            className="text-brand-600 font-medium hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            #{p.value}
          </Link>
        ) : (
          <span key={i}>{p.value}</span>
        ),
      )}
    </span>
  )
}

type Part = { type: 'text' | 'tag'; value: string }

function splitWithHashtags(text: string): Part[] {
  const re = /#([a-zA-Z][a-zA-Z0-9_]{0,30})/g
  const out: Part[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) })
    out.push({ type: 'tag', value: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) })
  return out
}
