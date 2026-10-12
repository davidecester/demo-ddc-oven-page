import { cx } from '../../utils/cx'
import { Icon } from '../ui/Icon'
import { BOTTOM_NAV } from './navItems'

/** Mobile/tablet app bar (Figma "BottomNavBar"), hidden from 1024px up. */
export function BottomNav() {
  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-black-8 bg-bg-secondary pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex h-(--spacing-bottom-nav) items-center justify-between px-4">
        {BOTTOM_NAV.map((item) => (
          <li key={item.key} className="min-w-0 flex-1">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-current={item.active ? 'page' : undefined}
              className={cx(
                'state-layer flex flex-col items-center gap-0.5 overflow-hidden rounded-md py-1 type-label-xs',
                item.active ? 'text-accent' : 'text-content-quaternary',
              )}
            >
              <Icon name={item.tabIcon!} size={30} />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
