import { type FormEvent, useRef, useState } from 'react'

interface QuickCaptureProps {
  onCreate: (title: string) => Promise<unknown>
  onError: () => void
}

export function QuickCapture({ onCreate, onError }: QuickCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedValue = value.trim()
    if (!trimmedValue || isSaving) {
      return
    }

    try {
      setIsSaving(true)
      await onCreate(trimmedValue)
      setValue('')
      inputRef.current?.focus()
    } catch {
      onError()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="rounded-[28px] border border-stone-200 bg-[linear-gradient(135deg,_rgba(248,245,239,0.96),_rgba(255,255,255,0.98))] p-4 shadow-[0_14px_40px_rgba(59,43,20,0.08)] md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Quick capture
          </p>
          <p className="mt-1 text-sm text-stone-600">
            The fastest path is type, Enter, continue.
          </p>
        </div>
        <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-500">
          Enter to save
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="What needs doing?"
          className="w-full rounded-[22px] border border-stone-300 bg-white px-5 py-4 text-lg text-stone-950 shadow-inner shadow-stone-100 outline-none ring-0 placeholder:text-stone-400 focus:border-stone-900"
        />
      </form>

      <p className="mt-3 text-sm text-stone-500">
        Try <span className="font-medium text-stone-700">tomorrow</span>,{' '}
        <span className="font-medium text-stone-700">every Friday</span>,{' '}
        <span className="font-medium text-stone-700">#platform</span>, or{' '}
        <span className="font-medium text-stone-700">@waiting</span>.
      </p>
    </section>
  )
}
