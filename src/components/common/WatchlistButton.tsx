import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M10 4.5v11M4.5 10h11"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M5.5 10.25l3 3 6.25-7.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface TipState {
  message: string
  x: number
  y: number
  below: boolean
}

function getTipPosition(btn: HTMLButtonElement): TipState | null {
  const rect = btn.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const spaceAbove = rect.top
  const below = spaceAbove < 52

  return {
    message: '',
    x,
    y: below ? rect.bottom + 10 : rect.top - 10,
    below,
  }
}

interface WatchlistButtonProps {
  inWatchlist: boolean
  onToggle: () => void
}

export function WatchlistButton({ inWatchlist, onToggle }: WatchlistButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [tip, setTip] = useState<TipState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateTipPosition = useCallback((message: string) => {
    const btn = btnRef.current
    if (!btn) return

    const pos = getTipPosition(btn)
    if (!pos) return

    setTip({ ...pos, message })
  }, [])

  const showTip = useCallback(
    (message: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      updateTipPosition(message)
      timerRef.current = setTimeout(() => setTip(null), 2600)
    },
    [updateTipPosition],
  )

  useEffect(() => {
    if (!tip) return

    const onMove = () => updateTipPosition(tip.message)

    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)

    return () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [tip, updateTipPosition])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    showTip(inWatchlist ? 'Removed from My List' : 'Added to My List')
    onToggle()
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
        className={`watchlist-btn ${inWatchlist ? 'is-active' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}
        aria-label={inWatchlist ? 'Remove from My List' : 'Add to My List'}
      >
        {inWatchlist ? <CheckIcon /> : <PlusIcon />}
      </button>

      {tip &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className={`watchlist-tip-portal ${tip.below ? 'watchlist-tip-portal--below' : ''}`}
            style={{
              left: `${tip.x}px`,
              top: `${tip.y}px`,
            }}
          >
            {tip.message}
          </div>,
          document.body,
        )}
    </>
  )
}
