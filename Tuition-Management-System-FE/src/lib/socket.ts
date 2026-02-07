import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket: Socket | null = null

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message)
  })

  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Socket event types
export interface SocketEvents {
  // Messaging
  'message:new': (data: { conversationId: string; message: unknown }) => void
  'message:read': (data: { conversationId: string; messageId: string; userId: string }) => void
  'typing:start': (data: { conversationId: string; userId: string }) => void
  'typing:stop': (data: { conversationId: string; userId: string }) => void
  
  // Notifications
  'notification:new': (data: unknown) => void
  
  // Online status
  'user:online': (data: { userId: string }) => void
  'user:offline': (data: { userId: string }) => void
  
  // Class events
  'class:updated': (data: { classId: string }) => void
  'enrollment:new': (data: { classId: string; studentId: string }) => void
  'enrollment:updated': (data: { enrollmentId: string; status: string }) => void
  
  // Session events
  'session:created': (data: { classId: string; sessionId: string }) => void
  'session:updated': (data: { sessionId: string }) => void
  'session:cancelled': (data: { sessionId: string }) => void
  
  // Announcement events
  'announcement:new': (data: { classId: string; announcement: unknown }) => void
}

// Helper to emit events with type safety
export const emitSocketEvent = <K extends keyof SocketEvents>(
  event: K,
  ...args: Parameters<SocketEvents[K]>
): void => {
  if (socket?.connected) {
    socket.emit(event, ...args)
  }
}

// Helper to join a room
export const joinRoom = (roomId: string): void => {
  if (socket?.connected) {
    socket.emit('room:join', { roomId })
  }
}

// Helper to leave a room
export const leaveRoom = (roomId: string): void => {
  if (socket?.connected) {
    socket.emit('room:leave', { roomId })
  }
}
