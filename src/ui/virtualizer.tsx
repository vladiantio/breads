import { useRef } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"

interface VirtualizerProps<T> {
  items: T[]
  render: (item: T) => React.ReactNode
  estimateSize?: (index: number) => number
  overscan?: number
}

export function RowVirtualizerDynamic<T>({
  items,
  render,
  estimateSize = () => 172,
  overscan = 5,
}: VirtualizerProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const scrollMargin = parentRef.current?.offsetTop ?? 0

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize,
    overscan,
    scrollMargin,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const translateY = (virtualItems[0]?.start ?? 0) - scrollMargin

  return (
    <div ref={parentRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            translate: `0px ${translateY}px`,
          }}
        >
          {virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              {render(items[virtualRow.index])}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
