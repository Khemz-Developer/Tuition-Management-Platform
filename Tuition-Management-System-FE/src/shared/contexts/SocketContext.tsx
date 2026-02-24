import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Socket } from 'socket.io-client'
import { initializeSocket, disconnectSocket, getSocket } from '@/lib/socket'
import { useAuth } from '../hooks/useAuth'
import { getAccessToken } from '../services/api'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = getAccessToken()
      if (token) {
        try {
          const socketInstance = initializeSocket(token)
          setSocket(socketInstance)

          socketInstance.on('connect', () => {
            setIsConnected(true)
          })

          socketInstance.on('disconnect', () => {
            setIsConnected(false)
          })

          socketInstance.on('connect_error', () => {
            console.warn('Socket connection failed, continuing without real-time features')
            setIsConnected(false)
          })
        } catch (error) {
          console.warn('Socket initialization failed, continuing without real-time features:', error)
          setIsConnected(false)
        }
      }
    } else {
      disconnectSocket()
      setSocket(null)
      setIsConnected(false)
    }

    return () => {
      const currentSocket = getSocket()
      if (currentSocket) {
        currentSocket.off('connect')
        currentSocket.off('disconnect')
      }
    }
  }, [isAuthenticated, user])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
