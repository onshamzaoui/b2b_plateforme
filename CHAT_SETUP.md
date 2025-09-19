# Chat System Setup Guide

## Ably Integration

This project uses [Ably](https://ably.com/) for real-time chat functionality between freelancers and enterprises.

### 1. Create Ably Account

1. Go to [https://ably.com/](https://ably.com/)
2. Sign up for a free account
3. Create a new app in the Ably dashboard
4. Copy your API key

### 2. Environment Variables

Add the following to your `.env.local` file:

```bash
NEXT_PUBLIC_ABLY_API_KEY="your-ably-api-key-here"
```

### 3. Features

- **Real-time messaging** between freelancers and enterprises
- **Mission-specific chat channels** for each mission
- **Simple chat interface** with message history
- **User identification** with avatars and names
- **Responsive design** that works on all devices

### 4. How It Works

- **Freelancers** can chat with enterprises after applying to a mission
- **Enterprises** can chat with freelancers who have applied to their missions
- Each mission has its own chat channel: `mission-{missionId}`
- Messages are sent in real-time using Ably's pub/sub system

### 5. Usage

The chat button appears on mission pages when:
- A freelancer has applied to a mission (can chat with the enterprise)
- An enterprise owns a mission (can chat with applicants)

### 6. Components

- `ChatButton` - Button that opens the chat modal
- `ChatWindow` - Main chat interface with message list and input
- `AblyProvider` - Context provider for Ably connection management

### 7. Free Tier Limits

Ably's free tier includes:
- 3 million messages per month
- 15,000 concurrent connections
- 100 channels

This should be sufficient for most B2B platforms starting out.

### 8. Security

- Messages are sent through Ably's secure channels
- User authentication is handled through NextAuth
- Channel names are based on mission IDs for isolation
