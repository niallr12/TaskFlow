import {
  forwardRef,
  type FormEvent,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface QuickCaptureProps {
  onCreate: (title: string) => Promise<unknown>
  onError: () => void
}

export interface QuickCaptureHandle {
  focus: () => void
  clear: () => void
  hasText: () => boolean
}

export const QuickCapture = forwardRef<QuickCaptureHandle, QuickCaptureProps>(
  function QuickCapture({ onCreate, onError }, ref) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        clear: () => setValue(''),
        hasText: () => value.trim().length > 0,
      }),
      [value],
    )

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
      <section className="rounded-2xl border border-stone-300 bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
              Quick capture
            </p>
          </div>
          <span className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-medium text-stone-500">
            Enter to save
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            id="quick-capture-input"
            ref={inputRef}
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="What needs doing?"
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-[15px] text-stone-950 outline-none placeholder:text-stone-400 focus:border-stone-900"
          />
        </form>

        <p className="mt-2 text-[12px] leading-5 text-stone-500">
          `N` focuses capture. Try `tomorrow`, `every Friday`, `#platform`, or
          `@waiting`.
        </p>
      </section>
    )
  },
)
