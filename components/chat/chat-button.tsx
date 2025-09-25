'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import { ChatWindow } from './chat-window'

interface ChatButtonProps {
  missionId: string
  otherParticipant?: {
    id: string
    name: string
    role: 'FREELANCE' | 'ENTREPRISE'
  }
  className?: string
}

export const ChatButton: React.FC<ChatButtonProps> = ({ 
  missionId, 
  otherParticipant, 
  className 
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const channelName = `mission-${missionId}`

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        variant="outline"
        size="sm"
        className={className}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Chat
      </Button>

      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Chat - Mission {missionId}
              </h3>
              <Button
                onClick={() => setIsChatOpen(false)}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ChatWindow
                channelName={channelName}
                missionId={missionId}
                otherParticipant={otherParticipant}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
