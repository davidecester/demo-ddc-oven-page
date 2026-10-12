interface TooltipRow {
  label: string
  value: string
  swatch?: string
}

interface ChartTooltipProps {
  title: string
  rows: TooltipRow[]
}

/** Tooltip surface for charts: white card, elevation 1, DDC type styles. */
export function ChartTooltip({ title, rows }: ChartTooltipProps) {
  return (
    <div className="flex min-w-[120px] flex-col gap-2 rounded-md bg-bg-primary px-3 py-2 shadow-elevation-1">
      <p className="type-label-xs text-content-primary">{title}</p>
      <ul className="flex flex-col gap-1">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1 type-paragraph-xs text-content-quaternary">
              {row.swatch && <span aria-hidden="true" className="size-2 rounded-xs" style={{ background: row.swatch }} />}
              {row.label}
            </span>
            <span className="type-label-xs text-content-primary tabular-nums">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
