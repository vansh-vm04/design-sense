
import { useEffect, useMemo, useRef, useState } from 'react'

type DataPoint = {
  day: string
  sales: string
}

type StaticsCardProps = {
  data?: DataPoint[]
}

export const StaticsCard = ({
  data = [
    { day: 'mon', sales: '747' },
    { day: 'tue', sales: '840' },
    { day: 'wed', sales: '300' },
    { day: 'thu', sales: '761' },
    { day: 'fri', sales: '77' },
    { day: 'sat', sales: '788' },
    { day: 'sun', sales: '735' },
  ],
}: StaticsCardProps) => {
  const normalized = useMemo(
    () =>
      data.map((item) => ({
        day: item.day.slice(0, 3),
        value: Number(item.sales) || 0,
      })),
    [data],
  )

  const values = normalized.map((item) => item.value)
  const totalValue = values.reduce((sum, value) => sum + value, 0)
  const max = Math.max(...values, 1)
  const defaultSelectedIndex = values.indexOf(max)
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex)

  useEffect(() => {
    setSelectedIndex(defaultSelectedIndex)
  }, [defaultSelectedIndex])

  const safeSelectedIndex = Math.min(Math.max(selectedIndex, 0), Math.max(normalized.length - 1, 0))
  const selected = normalized[safeSelectedIndex] ?? normalized[0]
  const selectedValue = selected?.value ?? 0
  const [displayValue, setDisplayValue] = useState(0)
  const previousValueRef = useRef(0)
  const [markerDisplayValue, setMarkerDisplayValue] = useState(0)
  const [barRevealProgress, setBarRevealProgress] = useState(0)

  useEffect(() => {
    const from = previousValueRef.current
    const to = totalValue
    const durationMs = 900
    const start = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = from + (to - from) * eased

      setDisplayValue(next)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        previousValueRef.current = to
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [totalValue])

  useEffect(() => {
    const from = 0
    const to = selectedValue
    const durationMs = 650
    const start = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = from + (to - from) * eased

      setMarkerDisplayValue(next)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [safeSelectedIndex, selectedValue])

  useEffect(() => {
    const durationMs = 500
    const start = performance.now()
    let frameId = 0

    setBarRevealProgress(0)

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setBarRevealProgress(eased)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [safeSelectedIndex])

  const chartHeight = 240
  const plotTop = 24
  const plotBottom = 200
  const xPositions = normalized.map((_, index) =>
    normalized.length === 1 ? 50 : ((index + 0.5) / normalized.length) * 100,
  )

  const points = normalized.map((item, index) => {
    const x = xPositions[index] ?? 50
    const ratio = item.value / max
    const y = plotBottom - ratio * (plotBottom - plotTop) * 0.65
    return { x, y }
  })

  const pathD =
    points.length <= 1
      ? `M 0 ${plotBottom} L 100 ${plotBottom}`
      : points
          .map((point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`
            const prev = points[index - 1]
            const cp1x = prev.x + (point.x - prev.x) / 2
            const cp2x = point.x - (point.x - prev.x) / 2
            return `C ${cp1x} ${prev.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`
          })
          .join(' ')

  const selectedX = points[safeSelectedIndex]?.x ?? 50
  const selectedY = points[safeSelectedIndex]?.y ?? plotBottom
  const selectedYPercent = (selectedY / chartHeight) * 100
  const selectedBarHeightPercent = Math.max(0, 100 - selectedYPercent)

  return (
    <div className="bg-gray-950 h-screen w-screen justify-center items-center flex p-4">
      <div className="relative w-full max-w-100 aspect-square rounded-[34px] bg-linear-to-b from-[#ff5b1e] to-[#ff4a17] p-8 pt-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-[20px] leading-none font-normal tracking-[-0.02em]">Statistics</h2>
          <button
            type="button"
            className="grid place-items-center h-14 w-14 rounded-full bg-white/25 text-white/90 backdrop-blur-sm"
            aria-label="Open statistics details"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 16L16 8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 8h7v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-white text-[36px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
          ${displayValue.toFixed(2)}
        </p>

        <div className="absolute left-8 right-8 bottom-16 h-40.5">
          <div className="absolute inset-0">
            {xPositions.map((x, idx) => (
              <button
                key={`${normalized[idx]?.day ?? 'day'}-${idx}-guide`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Select ${normalized[idx]?.day?.toUpperCase() ?? 'day'} sales`}
                className="absolute top-0 bottom-0 w-8 -translate-x-1/2"
                style={{ left: `${x}%` }}
              >
                <span className={`absolute inset-y-0 left-1/2 w-[1.6px] -translate-x-1/2 transition-opacity bg-linear-to-t from-white/25 to-white/6 ${safeSelectedIndex === idx && 'hidden'}`} />
              </button>
            ))}
          </div>

          <div className="absolute h-[1.6px] inset-x-0 bottom-0 bg-white/25" />

          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            shapeRendering="geometricPrecision"
          >
            <path
              d={pathD}
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute rounded-b-full bg-linear-to-t from-white/60 to-white/20 origin-bottom"
              style={{
                left: `${selectedX}%`,
                top: `${selectedYPercent-10}%`,
                height: `${selectedBarHeightPercent+10}%`,
                width: '32px',
                transform: `translateX(-50%) scaleY(${barRevealProgress})`,
                transitionDuration: '400ms',
                animationDirection: 'ease-in-out',
              }}
            />

            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${selectedX}%`, top: `${selectedYPercent}%` }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-full bg-white px-4 py-1 text-[14px] font-semibold text-[#282828] shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
                {Math.round(markerDisplayValue)}
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-white/95" />
            </div>
          </div>
        </div>

        <div
          className="absolute left-8 right-8 bottom-10 h-8 text-white/95 text-[12px] font-normal tracking-[-0.01em]"
        >
          {normalized.map((item, idx) => {
            const x = xPositions[idx] ?? 50
            return (
            <button
              key={`${item.day}-label-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`absolute bottom-0 -translate-x-1/2 uppercase text-center transition-opacity ${safeSelectedIndex === idx ? 'opacity-100 font-semibold' : 'opacity-80'} cursor-pointer`}
              style={{ left: `${x}%` }}
            >
              {item.day}
            </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
