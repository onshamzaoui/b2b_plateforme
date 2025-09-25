'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useAbly } from '@/components/ably-provider'
import { ChatMessage } from '@/types/chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, MessageCircle } from 'lucide-react'
import * as Ably from 'ably'

interface ChatWindowProps {
  channelName: string
  missionId?: string
  otherParticipant?: {
    id: string
    name: string
    role: 'FREELANCE' | 'ENTREPRISE'
  }
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  channelName, 
  missionId, 
  otherParticipant 
}) => {
  const { data: session } = useSession()
  const { ably, currentChannel, joinChannel, leaveChannel, isConnected } = useAbly()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Join channel and load message history when component mounts
  useEffect(() => {
    if (channelName) {
      const initializeChat = async () => {
        await joinChannel(channelName)
        await loadMessageHistory()
        // Mark messages as read when opening the conversation
        await markMessagesAsRead()
      }
      initializeChat()
    }

    return () => {
      leaveChannel()
    }
  }, [channelName, joinChannel, leaveChannel])

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName,
          action: 'markAsRead'
        }),
      })

      if (response.ok && ably && isConnected) {
        // Notify other participants that messages have been read
        if (otherParticipant) {
          const userChannel = ably.channels.get(`user-${otherParticipant.id}`)
          await userChannel.publish('messageRead', { 
            action: 'markAsRead', 
            channelName,
            userId: session?.user?.id 
          })
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const loadMessageHistory = async () => {
    try {
      const response = await fetch(`/api/chat/messages?channelName=${encodeURIComponent(channelName)}`)
      if (response.ok) {
        const data = await response.json()
        const messages = data.messages || []
        setMessages(messages)
        if (messages.length > 0) {
          setLastMessageId(messages[messages.length - 1].id)
        }
      }
    } catch (error) {
      console.error('Error loading message history:', error)
    }
  }

  const checkForNewMessages = async () => {
    if (!lastMessageId) return
    
    try {
      const response = await fetch(`/api/chat/messages?channelName=${encodeURIComponent(channelName)}&since=${lastMessageId}`)
      if (response.ok) {
        const data = await response.json()
        const newMessages = data.messages || []
        if (newMessages.length > 0) {
          setMessages(prev => [...prev, ...newMessages])
          setLastMessageId(newMessages[newMessages.length - 1].id)
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error)
    }
  }

  // Listen for messages via Ably
  useEffect(() => {
    if (!currentChannel || !isConnected) return

    const handleMessage = (message: Ably.Message) => {
      const messageData = message.data as ChatMessage
      
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(msg => msg.id === messageData.id)
        if (exists) return prev
        return [...prev, messageData]
      })
      setLastMessageId(messageData.id)
    }

    currentChannel.subscribe('message', handleMessage)

    return () => {
      currentChannel.unsubscribe('message', handleMessage)
    }
  }, [currentChannel, isConnected, session?.user?.id])

  // Polling fallback when Ably is not connected
  useEffect(() => {
    if (!isConnected && lastMessageId) {
      pollingIntervalRef.current = setInterval(checkForNewMessages, 3000) // Poll every 3 seconds
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [isConnected, lastMessageId, channelName])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !session?.user) return

    const messageText = newMessage.trim()
    setNewMessage('') // Clear input immediately for better UX

    try {
      // Save message to database
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName,
          content: messageText,
          messageType: 'TEXT'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const savedMessage = data.message
        
        // Publish to Ably channel for real-time delivery to all participants
        try {
          if (currentChannel && isConnected) {
            await currentChannel.publish('message', savedMessage)
            
            // Also publish to user-specific channels for notification updates
            if (otherParticipant) {
              const userChannel = ably.channels.get(`user-${otherParticipant.id}`)
              await userChannel.publish('newMessage', savedMessage)
            }
          } else {
            // If Ably is not connected, add to local state as fallback
            setMessages(prev => [...prev, savedMessage])
            setLastMessageId(savedMessage.id)
          }
        } catch (ablyError) {
          console.warn('Ably publish failed, adding to local state as fallback:', ablyError)
          setMessages(prev => [...prev, savedMessage])
          setLastMessageId(savedMessage.id)
        }
      } else {
        console.error('Error saving message:', response.statusText)
        // Re-add message to input if save failed
        setNewMessage(messageText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Re-add message to input if send failed
      setNewMessage(messageText)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!session?.user) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Veuillez vous connecter pour utiliser le chat</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col max-h-[600px] min-h-[400px]">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {otherParticipant ? `Chat avec ${otherParticipant.name}` : 'Chat'}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Aucun message pour le moment. Commencez la conversation !</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === session.user.id
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {getInitials(message.senderName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[70%] min-w-0 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block px-3 py-2 rounded-lg break-words ${
                        isOwnMessage
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.senderName} • {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="flex-1 resize-none min-h-[40px] max-h-[120px]"
              rows={1}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || !isConnected}
              size="sm"
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
