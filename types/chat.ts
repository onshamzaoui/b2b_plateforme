export interface ChatMessage {
  id: string
  text: string
  senderId: string
  senderName: string
  senderRole: 'FREELANCE' | 'ENTREPRISE'
  timestamp: number
  missionId?: string
}

export interface ChatChannel {
  id: string
  name: string
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
}
