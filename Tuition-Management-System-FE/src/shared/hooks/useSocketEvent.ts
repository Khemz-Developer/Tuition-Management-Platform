import { useEffect, useCallback } from 'react'
import { useSocket } from '../contexts/SocketContext'
import type { SocketEvents } from '@/lib/socket'

type EventHandler<K extends keyof SocketEvents> = SocketEvents[K]

export function useSocketEvent<K extends keyof SocketEvents>(
  event: K,
  handler: EventHandler<K>,
  deps: React.DependencyList = []
) {
  const { socket, isConnected } = useSocket()

  const memoizedHandler = useCallback(handler, deps)

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.on(event as string, memoizedHandler as (...args: unknown[]) => void)

    return () => {
      socket.off(event as string, memoizedHandler as (...args: unknown[]) => void)
    }
  }, [socket, isConnected, event, memoizedHandler])
}

export function useSocketEmit() {
  const { socket, isConnected } = useSocket()

  const emit = useCallback(
    <K extends keyof SocketEvents>(event: K, ...args: Parameters<SocketEvents[K]>) => {
      if (socket && isConnected) {
        socket.emit(event as string, ...args)
      }
    },
    [socket, isConnected]
  )

  return { emit, isConnected }
}
