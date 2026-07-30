import { NavLink } from 'react-router-dom'

interface NavSidebarProps {
  todayCount: number
  inboxCount: number
  waitingCount: number
  completedCount: number
}

interface NavItemProps {
  href: string
  label: string
  count: number
}

function NavItem({ href, label, count }: NavItemProps) {
  return (
    <NavLink
      to={href}
      end={href === '/'}
      className={({ isActive }) =>
        [
          'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
          isActive
            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
            : 'border-stone-200 bg-white/75 text-stone-700 hover:border-stone-300 hover:bg-white',
        ].join(' ')
      }
    >
      <span className="font-medium">{label}</span>
      <span className="rounded-full bg-black/8 px-2 py-0.5 text-xs font-semibold tracking-wide">
        {count}
      </span>
    </NavLink>
  )
}

export function NavSidebar({
  todayCount,
  inboxCount,
  waitingCount,
  completedCount,
}: NavSidebarProps) {
  return (
    <aside className="border-b border-stone-300/70 bg-transparent px-4 py-5 lg:w-[280px] lg:border-b-0 lg:px-5 lg:py-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          TaskFlow
        </p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-stone-950">
          Work dashboard
        </h1>
        <p className="mt-2 max-w-[22rem] text-sm leading-6 text-stone-600">
          Local-first, keyboard-first, and intentionally lightweight.
        </p>
      </div>

      <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <NavItem href="/" label="Today" count={todayCount} />
        <NavItem href="/inbox" label="Inbox" count={inboxCount} />
        <NavItem href="/waiting" label="Waiting" count={waitingCount} />
        <NavItem
          href="/completed"
          label="Completed This Week"
          count={completedCount}
        />
      </nav>
    </aside>
  )
}
