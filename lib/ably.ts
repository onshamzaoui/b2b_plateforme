import * as Ably from 'ably'

// Initialize Ably client only when needed to avoid build-time errors
export const getAbly = () => {
  const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY
  if (!apiKey || apiKey === 'dummy_key_for_build') {
    throw new Error('ABLY_API_KEY is not configured')
  }
  return new Ably.Realtime({
    key: apiKey,
    // Don't set clientId here - it will be set dynamically
  })
}

// Client-side safe Ably initialization
export const getAblyClient = () => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return getAbly()
  }
  
  // On client side, get the API key from the environment
  const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY
  if (!apiKey || apiKey === 'dummy_key_for_build') {
    throw new Error('ABLY_API_KEY is not configured')
  }
  return new Ably.Realtime({
    key: apiKey,
    // Don't set clientId here - it will be set dynamically
  })
}

// For backward compatibility, create a lazy-initialized ably instance
export const ably = new Proxy({} as Ably.Realtime, {
  get(target, prop) {
    const ablyInstance = getAblyClient()
    return ablyInstance[prop as keyof Ably.Realtime]
  }
})

// Helper function to get channel name for a mission
export const getMissionChannelName = (missionId: string) => {
  return `mission-${missionId}`
}

// Helper function to get channel name for user-to-user chat
export const getUserChannelName = (userId1: string, userId2: string) => {
  // Sort user IDs to ensure consistent channel naming
  const sortedIds = [userId1, userId2].sort()
  return `user-${sortedIds[0]}-${sortedIds[1]}`
}
