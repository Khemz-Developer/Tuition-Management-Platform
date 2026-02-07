import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { Separator } from '@/shared/components/ui/separator'
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react'
import { getInitials, cn } from '@/lib/utils'

// Placeholder data
const mockConversations = [
  {
    id: '1',
    name: 'Alice Brown',
    avatar: null,
    lastMessage: 'Thank you for the notes!',
    lastMessageTime: '2 min ago',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Bob Davis',
    avatar: null,
    lastMessage: 'Can you explain the homework?',
    lastMessageTime: '1 hour ago',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Carol Evans',
    avatar: null,
    lastMessage: 'I will be absent tomorrow',
    lastMessageTime: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '4',
    name: 'David Frank',
    avatar: null,
    lastMessage: 'Got it, thanks!',
    lastMessageTime: '2 days ago',
    unread: 0,
    online: false,
  },
]

const mockMessages = [
  {
    id: '1',
    sender: 'Alice Brown',
    content: 'Hello! I had a question about the calculus homework.',
    timestamp: '10:30 AM',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'Me',
    content: 'Sure, what do you need help with?',
    timestamp: '10:32 AM',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Alice Brown',
    content: 'I\'m stuck on problem 5, the one about integration by parts.',
    timestamp: '10:33 AM',
    isOwn: false,
  },
  {
    id: '4',
    sender: 'Me',
    content: 'Ah yes, that one can be tricky. The key is to identify which part to differentiate and which to integrate. Remember the LIATE rule?',
    timestamp: '10:35 AM',
    isOwn: true,
  },
  {
    id: '5',
    sender: 'Alice Brown',
    content: 'Oh right! Let me try that approach. Thank you for the notes!',
    timestamp: '10:38 AM',
    isOwn: false,
  },
]

export default function TeacherMessages() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messageInput, setMessageInput] = useState('')
  const [showConversationList, setShowConversationList] = useState(true)

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      setMessageInput('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header - only show on larger screens or when conversation list is visible */}
      <div className={cn('md:block', showConversationList ? 'block' : 'hidden')}>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Chat with your students</p>
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
                  placeholder="Search conversations..."
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
                    <p className="text-sm text-muted-foreground truncate">
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
                        {selectedConversation.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
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
