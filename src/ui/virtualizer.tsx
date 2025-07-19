import { useRef } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"

interface VirtualizerProps<T> extends React.ComponentProps<"div"> {
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
  ...props
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
    <div ref={parentRef} {...props}>
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

export function MasonryVerticalVirtualizerDynamic<T>({
  items,
  render,
  estimateSize = () => 400,
  overscan = 5,
  lanes = 2,
  ...props
}: VirtualizerProps<T> & {
  lanes?: number
}) {
  const parentRef = useRef<HTMLDivElement>(null)
  const scrollMargin = parentRef.current?.offsetTop ?? 0

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize,
    overscan,
    scrollMargin,
    lanes,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div ref={parentRef} {...props}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: `${virtualRow.lane * 100 / lanes}%`,
              width: `${100 / lanes}%`,
              translate: `0px ${virtualRow.start - scrollMargin}px`,
            }}
          >
            {render(items[virtualRow.index])}
          </div>
        ))}
      </div>
    </div>
  )
}
