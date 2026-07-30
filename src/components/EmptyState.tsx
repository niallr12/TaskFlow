interface EmptyStateProps {
  title: string
  message: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center">
      <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-stone-600">{message}</p>
    </div>
  )
}
