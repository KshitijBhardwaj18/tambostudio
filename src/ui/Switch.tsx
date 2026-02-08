import type { InputHTMLAttributes } from 'react'

import { cx } from './cx'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  description?: string
}

export function Switch({ label, description, className, checked, ...props }: SwitchProps) {
  return (
    <label className={cx('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {description ? <div className="text-xs text-slate-500">{description}</div> : null}
      </div>

      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          {...props}
        />
        <span
          aria-hidden="true"
          className={cx(
            'absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-slate-900',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white',
          )}
        />
        <span
          aria-hidden="true"
          className={cx(
            'relative inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow transition',
            'peer-checked:translate-x-5',
          )}
        />
      </span>
    </label>
  )
}
