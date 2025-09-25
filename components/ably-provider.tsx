'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ably } from '@/lib/ably'
import * as Ably from 'ably'

interface AblyContextType {
  ably: Ably.Realtime
  isConnected: boolean
  currentChannel: Ably.RealtimeChannel | null
  joinChannel: (channelName: string) => void
  leaveChannel: () => void
}

const AblyContext = createContext<AblyContextType | null>(null)

export const useAbly = () => {
  const context = useContext(AblyContext)
  if (!context) {
    throw new Error('useAbly must be used within an AblyProvider')
  }
  return context
}

interface AblyProviderProps {
  children: React.ReactNode
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children }) => {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<Ably.RealtimeChannel | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (session?.user?.id && !isInitialized) {
      // Set client ID based on user session
      ably.auth.clientId = session.user.id
      setIsInitialized(true)
    }

    // Listen for connection state changes
    const handleConnected = () => {
      setIsConnected(true)
    }

    const handleDisconnected = () => {
      setIsConnected(false)
    }

    const handleFailed = () => {
      setIsConnected(false)
    }

    ably.connection.on('connected', handleConnected)
    ably.connection.on('disconnected', handleDisconnected)
    ably.connection.on('failed', handleFailed)

    return () => {
      // Cleanup event listeners
      ably.connection.off('connected', handleConnected)
      ably.connection.off('disconnected', handleDisconnected)
      ably.connection.off('failed', handleFailed)
    }
  }, [session?.user?.id, isInitialized])

  const joinChannel = async (channelName: string) => {
    try {
      // Leave current channel if exists
      if (currentChannel) {
        await currentChannel.detach()
        setCurrentChannel(null)
      }

      // Small delay to ensure detach completes
      await new Promise(resolve => setTimeout(resolve, 100))

      // Join new channel
      const channel = ably.channels.get(channelName)
      setCurrentChannel(channel)
      await channel.attach()
    } catch (error) {
      console.error('Error joining channel:', error)
    }
  }

  const leaveChannel = async () => {
    try {
      if (currentChannel) {
        await currentChannel.detach()
        setCurrentChannel(null)
      }
    } catch (error) {
      console.error('Error leaving channel:', error)
    }
  }

  const value: AblyContextType = {
    ably,
    isConnected,
    currentChannel,
    joinChannel,
    leaveChannel
  }

  return (
    <AblyContext.Provider value={value}>
      {children}
    </AblyContext.Provider>
  )
}
