import { NavLink } from 'react-router-dom'

interface NavSidebarProps {
  todayCount: number
  inboxCount: number
  waitingCount: number
  recurringCount: number
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
          'flex items-center justify-between rounded-xl border px-3 py-2 text-left transition',
          isActive
            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
            : 'border-stone-200 bg-white/75 text-stone-700 hover:border-stone-300 hover:bg-white',
        ].join(' ')
      }
    >
      <span className="text-[14px] font-medium">{label}</span>
      <span className="rounded-md bg-black/8 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide">
        {count}
      </span>
    </NavLink>
  )
}

export function NavSidebar({
  todayCount,
  inboxCount,
  waitingCount,
  recurringCount,
  completedCount,
}: NavSidebarProps) {
  return (
    <nav className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
      <NavItem href="/" label="Today" count={todayCount} />
      <NavItem href="/inbox" label="Inbox" count={inboxCount} />
      <NavItem href="/waiting" label="Waiting" count={waitingCount} />
      <NavItem href="/recurring" label="Recurring" count={recurringCount} />
      <NavItem
        href="/completed"
        label="Completed This Week"
        count={completedCount}
      />
    </nav>
  )
}
