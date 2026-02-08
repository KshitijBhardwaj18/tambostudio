import type { ReactNode } from 'react'

import { cx } from './cx'

export type ToastItem = {
  id: string
  title: string
  message?: string
  icon?: ReactNode
}

export function ToastStack({
  items,
  onDismiss,
}: {
  items: ToastItem[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={cx(
            'pointer-events-auto rounded-xl border border-slate-200 bg-white p-3 shadow-lg',
            'animate-[toast-in_120ms_ease-out]',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-2">
              {t.icon ? <div className="mt-0.5 shrink-0">{t.icon}</div> : null}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{t.title}</div>
                {t.message ? (
                  <div className="mt-0.5 text-xs text-slate-600">{t.message}</div>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              className="-mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
