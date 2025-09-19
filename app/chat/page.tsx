'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Search, ArrowLeft, Users, Building } from 'lucide-react'
import { ChatWindow } from '@/components/chat/chat-window'
import { useAbly } from '@/components/ably-provider'
import * as Ably from 'ably'

interface Conversation {
  id: string
  name: string
  lastMessage?: string
  lastMessageTime?: number
  unreadCount: number
  participant: {
    id: string
    name: string
    role: 'FREELANCE' | 'ENTREPRISE'
  }
  missionId?: string
  missionTitle?: string
}

function ChatPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const { ably, isConnected } = useAbly()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Get conversation ID from URL params
  const conversationId = searchParams.get('conversation')

  useEffect(() => {
    if (conversationId) {
      setSelectedConversation(conversationId)
    }
  }, [conversationId])

  // Load conversations
  useEffect(() => {
    if (session?.user?.id) {
      loadConversations()
    }
  }, [session?.user?.id])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      } else {
        console.error('Error loading conversations:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.missionTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedConv = conversations.find(conv => conv.id === selectedConversation)

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 1000 * 60) return 'À l\'instant'
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}min`
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h`
    return new Date(timestamp).toLocaleDateString('fr-FR')
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
      <div className="container py-8 mx-auto w-screen">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center h-96">
              <p className="text-muted-foreground">Veuillez vous connecter pour accéder au chat</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto w-screen">
      <div className="max-w-7xl mx-auto">
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Communiquez avec vos clients et freelances en temps réel
          </p>
        </div> */}

        <div className="grid lg:grid-cols-3 gap-6 h-[650px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  {!isConnected && (
                    <Badge variant="outline" className="text-xs">
                      Déconnecté
                    </Badge>
                  )}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-0">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Chargement des conversations...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation pour le moment'}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 ${
                          selectedConversation === conversation.id ? 'bg-violet-50 dark:bg-violet-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm">
                              {getInitials(conversation.participant.name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {conversation.name}
                              </h4>
                              {conversation.lastMessageTime && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.lastMessageTime)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {conversation.participant.role === 'FREELANCE' ? (
                                  <>
                                    <Users className="h-3 w-3 mr-1" />
                                    Freelance
                                  </>
                                ) : (
                                  <>
                                    <Building className="h-3 w-3 mr-1" />
                                    Entreprise
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            {conversation.missionTitle && (
                              <p className="text-xs text-muted-foreground mb-1 truncate">
                                Mission: {conversation.missionTitle}
                              </p>
                            )}
                            
                            {conversation.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </p>
                            )}
                            
                            {conversation.unreadCount > 0 && (
                              <div className="flex justify-end mt-2">
                                <Badge className="bg-violet-600 text-white text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            {selectedConversation ? (
              <div className="h-full flex flex-col min-h-[500px]">
                <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    {selectedConv?.name}
                  </h2>
                </div>
                
                <div className="flex-1 min-h-0">
                  <ChatWindow
                    channelName={selectedConversation}
                    missionId={selectedConv?.missionId}
                    otherParticipant={selectedConv?.participant}
                  />
                </div>
              </div>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                    <p className="text-muted-foreground">
                      Choisissez une conversation dans la liste pour commencer à discuter
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper component with Suspense boundary
function ChatPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatPage />
    </Suspense>
  )
}

export default ChatPageWithSuspense
