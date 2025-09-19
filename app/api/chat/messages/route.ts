import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { channelName, content, messageType = 'TEXT' } = body

    if (!channelName || !content) {
      return NextResponse.json(
        { error: 'channelName et content sont requis' },
        { status: 400 }
      )
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { channelName }
    })

    if (!conversation) {
      // Extract mission ID from channel name if it's a mission channel
      const missionId = channelName.startsWith('mission-') 
        ? channelName.replace('mission-', '') 
        : null

      conversation = await prisma.conversation.create({
        data: {
          channelName,
          missionId
        }
      })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.user.id,
        content,
        messageType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      message: {
        id: message.id,
        text: message.content,
        senderId: message.senderId,
        senderName: message.sender.name,
        senderRole: message.sender.role,
        timestamp: message.createdAt.getTime(),
        messageType: message.messageType
      }
    })
  } catch (error) {
    console.error('Error saving message:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const channelName = searchParams.get('channelName')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const since = searchParams.get('since')

    if (!channelName) {
      return NextResponse.json(
        { error: 'channelName est requis' },
        { status: 400 }
      )
    }

    // Find conversation
    const conversation = await prisma.conversation.findUnique({
      where: { channelName }
    })

    if (!conversation) {
      return NextResponse.json({ messages: [] })
    }

    // Check if user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: session.user.id
        }
      }
    })

    if (!participant) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    // Build where clause
    const whereClause: any = { conversationId: conversation.id }
    
    // If since parameter is provided, get messages after that ID
    if (since) {
      const sinceMessage = await prisma.message.findUnique({
        where: { id: since }
      })
      if (sinceMessage) {
        whereClause.createdAt = { gt: sinceMessage.createdAt }
      }
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset
    })

    // Update last read timestamp
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: session.user.id
        }
      },
      data: { lastReadAt: new Date() }
    })

    const formattedMessages = messages.map((message: any) => ({
      id: message.id,
      text: message.content,
      senderId: message.senderId,
      senderName: message.sender.name,
      senderRole: message.sender.role,
      timestamp: message.createdAt.getTime(),
      messageType: message.messageType
    }))

    return NextResponse.json({ messages: formattedMessages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des messages' },
      { status: 500 }
    )
  }
}
