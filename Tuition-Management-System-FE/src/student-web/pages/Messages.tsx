import { useState } from 'react'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { Search, Send, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react'
import { getInitials, cn } from '@/lib/utils'

// Placeholder data
const mockConversations = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Teacher',
    avatar: null,
    lastMessage: 'Great work on your assignment!',
    lastMessageTime: '10 min ago',
    unread: 1,
    online: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Teacher',
    avatar: null,
    lastMessage: 'Remember to review chapter 5',
    lastMessageTime: '2 hours ago',
    unread: 0,
    online: false,
  },
]

const mockMessages = [
  {
    id: '1',
    sender: 'John Smith',
    content: 'Hello! How are you doing with the calculus homework?',
    timestamp: '10:00 AM',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'Me',
    content: 'Hi! I\'m working on it. Having some trouble with problem 3.',
    timestamp: '10:02 AM',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'John Smith',
    content: 'No worries! Try breaking it down into smaller steps. Start by identifying the function you need to differentiate.',
    timestamp: '10:05 AM',
    isOwn: false,
  },
  {
    id: '4',
    sender: 'Me',
    content: 'Got it, I\'ll try that approach. Thanks!',
    timestamp: '10:07 AM',
    isOwn: true,
  },
  {
    id: '5',
    sender: 'John Smith',
    content: 'Great work on your assignment!',
    timestamp: '10:30 AM',
    isOwn: false,
  },
]

export default function StudentMessages() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messageInput, setMessageInput] = useState('')
  const [showConversationList, setShowConversationList] = useState(true)

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className={cn('md:block', showConversationList ? 'block' : 'hidden')}>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Chat with your teachers</p>
      </div>

      <Card className="h-[calc(100vh-220px)] min-h-[500px]">
        <div className="flex h-full">
          {/* Conversation list */}
          <div
            className={cn(
              'w-full md:w-80 border-r flex flex-col',
              !showConversationList && 'hidden md:flex'
            )}
          >
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    'flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                    selectedConversation?.id === conversation.id && 'bg-muted'
                  )}
                  onClick={() => {
                    setSelectedConversation(conversation)
                    setShowConversationList(false)
                  }}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        {conversation.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="rounded-full">{conversation.unread}</Badge>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div
            className={cn(
              'flex-1 flex flex-col',
              showConversationList && 'hidden md:flex'
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setShowConversationList(true)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar>
                      <AvatarFallback>{getInitials(selectedConversation.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.online ? 'Online' : 'Offline'} • {selectedConversation.role}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg px-4 py-2',
                            message.isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p>{message.content}</p>
                          <p
                            className={cn(
                              'text-xs mt-1',
                              message.isOwn
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            )}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
