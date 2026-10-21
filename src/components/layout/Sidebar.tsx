import { assetUrl } from '../../utils/assets'
import { cx } from '../../utils/cx'
import { Icon } from '../ui/Icon'
import { SIDEBAR_GUIDE, SIDEBAR_MAIN, SIDEBAR_SETTINGS, type NavItem } from './navItems'

/** Desktop rail navigation (94px), from 1024px up. */
export function Sidebar() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 hidden h-dvh w-(--spacing-sidebar) shrink-0 flex-col items-center bg-bg-secondary px-3 pb-6 lg:flex"
    >
      <a href="#" onClick={(e) => e.preventDefault()} className="flex w-full flex-col items-center gap-2 rounded-md py-8">
        <img src={assetUrl('images/ddc-logo.png')} alt="" className="size-10 object-contain" />
        <span className="flex flex-col items-center text-center text-content-secondary">
          <span className="type-label-lg">UNOX</span>
          <span className="type-paragraph-xs">Data Driven Cooking</span>
        </span>
      </a>

      <ul className="flex w-[70px] flex-col items-center gap-4">
        {SIDEBAR_MAIN.map((item) => (
          <li key={item.key} className="w-full">
            <SidebarLink item={item} />
          </li>
        ))}
        <li aria-hidden="true" className="h-px w-full bg-black-8" />
        <li className="w-full">
          <SidebarLink item={SIDEBAR_SETTINGS} />
        </li>
      </ul>

      <div className="mt-auto w-[70px]">
        <SidebarLink item={SIDEBAR_GUIDE} />
      </div>
    </nav>
  )
}

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-current={item.active ? 'page' : undefined}
      className={cx(
        'state-layer flex w-full flex-col items-center gap-1 rounded-md py-1 type-label-xs',
        item.active ? 'text-accent' : 'text-content-quaternary',
      )}
    >
      <Icon name={item.sidebarIcon} size={24} />
      {item.label}
    </a>
  )
}
