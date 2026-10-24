import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { RecipeCategoryIcon, RecipeTab, RecipeTabKey } from '../../types/oven'
import { cx } from '../../utils/cx'
import { Card, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { RECIPES_CARD_ID } from './anchors'

interface RecipesCardProps {
  tabs: RecipeTab[] | null
  /** "Create a recipe group" in the empty state. */
  onCreateGroup: () => void
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
  chicken: 'chicken-color',
  pizza: 'pizza-color',
  frozenSnack: 'frozen-snack-color',
  sandwich: 'sandwich-color',
  eggs: 'eggs-color',
  puffPastry: 'puff-pastry-color',
  dessert: 'dessert-color',
  toast: 'toast-color',
}

/** "Ricette presenti nel forno": tabs per recipe type, then recipe categories. */
export function RecipesCard({ tabs, onCreateGroup, className }: RecipesCardProps) {
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
    <Card id={RECIPES_CARD_ID} labelledBy="recipes-title" className={`anchor-target gap-9 ${className ?? ''}`}>
      <div className="flex flex-col gap-4">
        <CardTitle id="recipes-title">Recipes on the oven</CardTitle>
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
        {current.categories.length > 0 ? (
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
                      <span className="type-paragraph-xs text-content-quaternary">{cat.count} {cat.count === 1 ? 'recipe' : 'recipes'}</span>
                    </span>
                  </span>
                  <span className="flex w-10 shrink-0 items-center justify-center p-2">
                    <Icon name="chevron-next" size={24} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          // New oven: nothing uploaded yet (Figma "Forno Appena Registrato")
          <div className="flex min-h-[150px] flex-col items-start justify-center gap-4 lg:min-h-[110px]">
            <div className="flex max-w-[321px] flex-col gap-1">
              <p className="type-label-lg text-content-primary">No recipes uploaded</p>
              <p className="type-paragraph-sm text-content-quaternary">
                Create a new recipe group and upload it to the oven.
              </p>
            </div>
            <Button icon="add-white" onClick={onCreateGroup} fullWidth className="md:w-auto">
              Create a recipe group
            </Button>
          </div>
        )}
        </div>
      ) : (
        <p className="type-paragraph-sm text-content-quaternary">No recipes</p>
      )}
    </Card>
  )
}
