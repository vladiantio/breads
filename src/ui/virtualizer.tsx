import { useCallback, useRef, useState, useSyncExternalStore } from "react"
import {
  useWindowVirtualizer,
  type VirtualItem,
} from "@tanstack/react-virtual"

function useScrollMargin(parentRef: React.RefObject<HTMLDivElement | null>) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const el = parentRef.current
      if (!el) return () => {}
      const update = () => onStoreChange()
      const observer = new ResizeObserver(update)
      observer.observe(el)
      update()
      return () => observer.disconnect()
    },
    [parentRef]
  )

  return useSyncExternalStore(
    subscribe,
    () => parentRef.current?.offsetTop ?? 0,
    () => 0
  )
}

interface VirtualizerStore {
  subscribe: (listener: () => void) => () => void
  emit: () => void
}

function createVirtualizerStore(): VirtualizerStore {
  const listeners = new Set<() => void>()
  return {
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    emit: () => {
      listeners.forEach((listener) => listener())
    },
  }
}

function useVirtualizerState(options: Parameters<typeof useWindowVirtualizer>[0]) {
  const [store] = useState(createVirtualizerStore)

  const virtualizer = useWindowVirtualizer({
    ...options,
    onChange: (instance, sync) => {
      store.emit()
      options.onChange?.(instance, sync)
    },
  })

  const virtualItems = useSyncExternalStore(
    store.subscribe,
    () => virtualizer.getVirtualItems(),
    () => []
  )
  const totalSize = useSyncExternalStore(
    store.subscribe,
    () => virtualizer.getTotalSize(),
    () => 0
  )

  return { virtualizer, virtualItems, totalSize }
}

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
  const scrollMargin = useScrollMargin(parentRef)

  const { virtualizer, virtualItems, totalSize } = useVirtualizerState({
    count: items.length,
    estimateSize,
    overscan,
    scrollMargin,
  })

  const translateY = (virtualItems[0]?.start ?? 0) - scrollMargin

  return (
    <div ref={parentRef} {...props}>
      <div
        style={{
          height: `${totalSize}px`,
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
  const scrollMargin = useScrollMargin(parentRef)

  const { virtualizer, virtualItems, totalSize } = useVirtualizerState({
    count: items.length,
    estimateSize,
    overscan,
    scrollMargin,
    lanes,
  })

  return (
    <div ref={parentRef} {...props}>
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow: VirtualItem) => (
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
