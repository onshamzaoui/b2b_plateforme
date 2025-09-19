import * as Ably from 'ably'

// Initialize Ably client
export const ably = new Ably.Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY || 'your-ably-api-key',
  // Don't set clientId here - it will be set dynamically
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
