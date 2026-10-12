import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon } from './Icon'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  /** Icon file name (20px slot). */
  icon?: string
  fullWidth?: boolean
  children: ReactNode
}

const VARIANTS: Record<ButtonVariant, string> = {
  // Figma "Primary-CTA": accent, 36px, button/medium
  primary: 'state-layer-inverse bg-accent text-white type-button-md',
  // Figma toolbar "Analytics" button: secondary surface, button/small
  secondary: 'state-layer bg-bg-secondary text-content-quaternary type-button-sm',
}

export function Button({
  variant = 'primary',
  icon,
  fullWidth = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 whitespace-nowrap',
        'aria-disabled:opacity-50',
        VARIANTS[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  /** Accessible name (required: the button has no visible text). */
  label: string
  iconSize?: number
  /** Square size in px: 32, 36 or 40 in the Figma file. */
  boxSize?: 32 | 36 | 40
}

const BOX: Record<NonNullable<IconButtonProps['boxSize']>, string> = {
  32: 'size-8',
  36: 'size-9',
  40: 'size-10',
}

export function IconButton({ icon, label, iconSize = 20, boxSize = 36, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx('state-layer inline-flex shrink-0 items-center justify-center rounded-md', BOX[boxSize], className)}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  )
}
