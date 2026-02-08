import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from './cx'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex items-start justify-between gap-4 px-4 py-3', className)}>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? (
          <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('px-4 pb-4', className)} {...props} />
}
