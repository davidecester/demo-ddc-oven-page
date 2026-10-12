import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { RecipeCategoryIcon, RecipeTab, RecipeTabKey } from '../../types/oven'
import { cx } from '../../utils/cx'
import { Card, CardTitle } from '../ui/Card'
import { Icon } from '../ui/Icon'

interface RecipesCardProps {
  tabs: RecipeTab[] | null
  className?: string
}

const TAB_ICON: Record<RecipeTabKey, string> = {
  programs: 'tab-programs',
  multiTime: 'tab-multi-time',
  miseEnPlace: 'tab-mise-en-place',
}

const CATEGORY_ICON: Record<RecipeCategoryIcon, string> = {
  beef: 'beef-color',
  seafood: 'seafood-color',
  vegetable: 'vegetable-color',
  bread: 'bread-color',
}

/** "Ricette presenti nel forno": tabs per recipe type, then recipe categories. */
export function RecipesCard({ tabs, className }: RecipesCardProps) {
  const [active, setActive] = useState<RecipeTabKey>(tabs?.[0]?.key ?? 'programs')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const baseId = useId()

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (!tabs) return
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + tabs.length) % tabs.length
    setActive(tabs[next].key)
    tabRefs.current[next]?.focus()
  }

  const current = tabs?.find((t) => t.key === active)

  return (
    <Card labelledBy="recipes-title" className={`gap-9 ${className ?? ''}`}>
      <div className="flex flex-col gap-4">
        <CardTitle id="recipes-title">Ricette presenti nel forno</CardTitle>
        {tabs && (
          // Tabs scroll horizontally on narrow screens (Figma "~h-scroll")
          <div className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div
              role="tablist"
              aria-labelledby="recipes-title"
              className="inline-flex items-start gap-1 rounded-md bg-bg-secondary p-1 md:gap-2"
            >
              {tabs.map((tab, i) => {
                const selected = tab.key === active
                const total = tab.categories.reduce((sum, c) => sum + c.count, 0)
                return (
                  <button
                    key={tab.key}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${tab.key}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(tab.key)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className={cx(
                      'state-layer flex shrink-0 items-center justify-center gap-1 rounded-sm px-3 py-1 text-[14px] leading-4 whitespace-nowrap',
                      selected
                        ? 'bg-bg-primary font-fixed font-bold text-content-primary'
                        : 'type-paragraph-sm text-content-quaternary hover:text-content-primary',
                    )}
                  >
                    <Icon name={TAB_ICON[tab.key]} size={20} tint />
                    {tab.label} ({total})
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {current ? (
        <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${current.key}`}>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {current.categories.map((cat) => (
            <li key={cat.name}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="state-layer flex items-center justify-between rounded-md bg-bg-secondary p-4"
              >
                <span className="flex min-w-0 flex-1 items-center gap-4 pr-4">
                  <span className="flex size-8 shrink-0 items-center justify-center">
                    <Icon name={CATEGORY_ICON[cat.icon]} size={32} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="type-label-md text-content-primary">{cat.name}</span>
                    <span className="type-paragraph-xs text-content-quaternary">{cat.count} ricette</span>
                  </span>
                </span>
                <span className="flex w-10 shrink-0 items-center justify-center p-2">
                  <Icon name="chevron-next" size={24} />
                </span>
              </a>
            </li>
          ))}
        </ul>
        </div>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">Nessuna ricetta presente</p>
      )}
    </Card>
  )
}
