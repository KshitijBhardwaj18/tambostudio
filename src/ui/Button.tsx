import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from './cx'

type Variant = 'primary' | 'secondary' | 'ghost'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  leftIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  leftIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        disabled && 'cursor-not-allowed opacity-60',
        variant === 'primary' &&
          'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-900',
        variant === 'secondary' &&
          'bg-white text-slate-900 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 active:bg-slate-100',
        variant === 'ghost' &&
          'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon ? <span className="-ml-0.5">{leftIcon}</span> : null}
      {children}
    </button>
  )
}
