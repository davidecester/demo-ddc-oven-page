import { Button, IconButton } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Avatar } from './Avatar'

interface TopBarProps {
  ovenName: string
  /** A page inside the oven (e.g. Activity trend): the back button and the oven crumb return to the oven. */
  subpage?: { title: string; onBack: () => void }
}

/**
 * Fixed top area ("Fixed / Top" in Figma).
 * Mobile/tablet: avatar + actions, then back · title · Analytics.
 * Desktop: search + actions, then breadcrumb · Analytics.
 */
export function TopBar({ ovenName, subpage }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-bg-primary">
      {/* HeaderDDC */}
      <div className="flex items-center justify-between px-3 py-2 lg:px-6 lg:py-4">
        <div className="lg:hidden">
          <Avatar initials="EG" />
        </div>

        <label className="hidden w-[320px] items-center gap-4 overflow-hidden rounded-md bg-bg-secondary pl-2 focus-within:outline-2 focus-within:outline-accent lg:flex">
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent type-label-sm text-content-primary outline-none placeholder:text-grey-300"
          />
          <span className="flex h-9 items-center justify-center p-2">
            <Icon name="search" size={20} />
          </span>
        </label>

        <div className="flex items-center justify-end gap-2">
          <IconButton icon="send-to-oven" label="Send to oven" />
          <IconButton icon="notifications" label="Notifications" />
          <IconButton icon="search" label="Search" className="lg:hidden" />
          <button
            type="button"
            aria-label="What’s new"
            title="What’s new"
            className="state-layer hidden size-9 items-center justify-center rounded-md border-[1.5px] border-new-features bg-new-features-8 lg:flex"
          >
            <Icon name="new-features" size={20} />
          </button>
          <div className="hidden lg:block">
            <Avatar initials="EG" />
          </div>
        </div>
      </div>

      {/* ToolbarDDC */}
      <div className="flex h-[52px] items-center justify-between gap-2 px-3 py-2 lg:h-[60px] lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <IconButton
            icon="nav-back"
            label={subpage ? `Back to ${ovenName}` : 'Back to Ovens'}
            onClick={subpage?.onBack}
            className="lg:hidden"
          />
          <p className="min-w-0 truncate type-label-sm text-content-tertiary lg:hidden">{subpage?.title ?? ovenName}</p>

          <nav aria-label="Breadcrumb" className="hidden lg:block">
            <ol className="flex items-center gap-1">
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block rounded-sm py-2 font-fixed text-[12px] leading-[1.15] font-medium text-content-tertiary underline hover:no-underline"
                >
                  Ovens
                </a>
              </li>
              <li aria-hidden="true">
                <Icon name="breadcrumb-next" size={20} />
              </li>
              <li>
                {subpage ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      subpage.onBack()
                    }}
                    className="block rounded-sm py-2 font-fixed text-[12px] leading-[1.15] font-medium text-content-tertiary underline hover:no-underline"
                  >
                    {ovenName}
                  </a>
                ) : (
                  <span aria-current="page" className="block py-2 font-fixed text-[12px] leading-[1.15] font-medium text-content-tertiary">
                    {ovenName}
                  </span>
                )}
              </li>
              {subpage && (
                <>
                  <li aria-hidden="true">
                    <Icon name="breadcrumb-next" size={20} />
                  </li>
                  <li>
                    <span aria-current="page" className="block py-2 font-fixed text-[12px] leading-[1.15] font-medium text-content-tertiary">
                      {subpage.title}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" icon="analytics">
            Analytics
          </Button>
          <IconButton icon="more" label="More options" />
        </div>
      </div>
    </header>
  )
}
