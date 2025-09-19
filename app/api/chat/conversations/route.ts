import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Get conversations where user is a participant
    const userConversations = await prisma.conversationParticipant.findMany({
      where: { userId: session.user.id },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    role: true
                  }
                }
              }
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    role: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc'
        }
      }
    })

    const conversations = userConversations.map(participant => {
      const conversation = participant.conversation
      const otherParticipant = conversation.participants.find(p => p.userId !== session.user.id)
      const lastMessage = conversation.messages[0]
      
      // Count unread messages (messages after lastReadAt)
      const unreadCount = conversation.messages.filter(msg => 
        msg.createdAt > participant.lastReadAt && msg.senderId !== session.user.id
      ).length

      return {
        id: conversation.channelName,
        name: otherParticipant?.user.name || 'Utilisateur inconnu',
        lastMessage: lastMessage?.content,
        lastMessageTime: lastMessage?.createdAt.getTime(),
        unreadCount,
        participant: {
          id: otherParticipant?.user.id || '',
          name: otherParticipant?.user.name || 'Utilisateur inconnu',
          role: otherParticipant?.user.role || 'FREELANCE'
        },
        missionId: conversation.missionId,
        missionTitle: conversation.missionId ? `Mission ${conversation.missionId}` : undefined
      }
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des conversations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { missionId, participantId, action, channelName: requestChannelName } = body

    // Handle markAsRead action
    if (action === 'markAsRead' && requestChannelName) {
      const conversation = await prisma.conversation.findUnique({
        where: { channelName: requestChannelName }
      })

      if (conversation) {
        await prisma.conversationParticipant.update({
          where: {
            conversationId_userId: {
              conversationId: conversation.id,
              userId: session.user.id
            }
          },
          data: { lastReadAt: new Date() }
        })
      }

      return NextResponse.json({ success: true })
    }

    if (!missionId || !participantId) {
      return NextResponse.json(
        { error: 'missionId et participantId sont requis' },
        { status: 400 }
      )
    }

    // Verify the user has permission to chat about this mission
    // For now, we'll allow any authenticated user to create conversations
    // In production, you'd add proper permission checks

    const channelName = `mission-${missionId}`
    
    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { channelName }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          channelName,
          missionId
        }
      })
    }

    // Add participants if they don't exist
    const existingParticipant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: session.user.id
        }
      }
    })

    if (!existingParticipant) {
      await prisma.conversationParticipant.create({
        data: {
          conversationId: conversation.id,
          userId: session.user.id
        }
      })
    }

    // Add the other participant if provided
    if (participantId && participantId !== session.user.id) {
      const otherParticipant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId: conversation.id,
            userId: participantId
          }
        }
      })

      if (!otherParticipant) {
        await prisma.conversationParticipant.create({
          data: {
            conversationId: conversation.id,
            userId: participantId
          }
        })
      }
    }
    
    return NextResponse.json({
      conversationId: conversation.channelName,
      message: 'Conversation créée avec succès'
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la conversation' },
      { status: 500 }
    )
  }
}
