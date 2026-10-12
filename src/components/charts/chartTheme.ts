import { createElement } from 'react'

/** Shared Recharts styling so both charts match the Figma axis/grid specs. */
export const axisTick = {
  fill: 'var(--color-content-quaternary)',
  fontFamily: 'var(--font-fixed)',
  fontSize: 12,
}

export const gridStroke = 'var(--color-grey-100)'

interface YTickProps {
  x?: number | string
  y?: number | string
  payload?: { value: number }
  format: (value: number) => string
}

/**
 * Y-axis label centred on its grid line, including the top and bottom ones
 * (Recharts' default nudges edge labels inward; Figma keeps them centred).
 */
export function renderYTick({ x, y, payload, format }: YTickProps) {
  return createElement(
    'text',
    { x: Number(x), y: Number(y), dy: '0.35em', textAnchor: 'end', ...axisTick },
    payload ? format(payload.value) : '',
  )
}
