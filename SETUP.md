# Ultra Chat App - Complete Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key
   - Create `.env` file:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Set Up Database**
   - Open Supabase SQL Editor
   - Copy and paste contents of `supabase-setup.sql`
   - Run the script

4. **Set Up Storage**
   - Go to Storage in Supabase dashboard
   - Click "New bucket"
   - Name: `media`
   - Public: Yes
   - Policies: Allow authenticated users to upload/read

5. **Enable Google OAuth** (Optional but recommended)
   - Go to Authentication > Providers
   - Enable Google
   - Add OAuth credentials from Google Cloud Console

6. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
ultra-chat-app/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Login.tsx          # Authentication UI
│   │   ├── Chat/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── MessageReactions.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── Call/
│   │   │   ├── CallScreen.tsx      # Active call UI
│   │   │   └── IncomingCall.tsx    # Incoming call UI
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx         # Main sidebar
│   │   │   └── ChatView.tsx        # Chat interface
│   │   └── ErrorBoundary.tsx       # Error handling
│   ├── context/
│   │   ├── AuthContext.tsx         # Authentication state
│   │   ├── ChatContext.tsx         # Chat state & real-time
│   │   └── ThemeContext.tsx        # Theme management
│   ├── hooks/
│   │   └── useOnlineStatus.ts      # Online status tracking
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── webrtc.ts              # WebRTC configuration
│   │   ├── utils.ts               # Utility functions
│   │   ├── constants.ts           # App constants
│   │   └── conversationHelpers.ts # Conversation utilities
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── supabase-setup.sql              # Database schema
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Features Implemented

### ✅ Real-time Communication
- Real-time messaging via Supabase Realtime
- Typing indicators
- Read receipts (blue ticks)
- Online/Last seen status
- Message reactions
- Reply/Forward functionality
- Pin chats
- Mute notifications

### ✅ Media Sharing
- Drag & Drop file sharing
- Image compression
- Voice notes
- File attachments

### ✅ Calling
- Voice & Video calling UI
- WebRTC with 20+ STUN/TURN servers
- Call controls (mute, video toggle, fullscreen)

### ✅ UI/UX
- Instagram/WhatsApp DM style
- Glassmorphism design
- Dark/Light mode
- Optimized rendering
- Zero lag performance

### ✅ Authentication
- Google OAuth (Primary)
- Email/Password fallback
- Seamless auth flow

## WebRTC Configuration

The app includes comprehensive STUN/TURN server configuration:
- 5 Google STUN servers
- Twilio STUN/TURN servers
- Mozilla STUN
- Open Relay Project TURN servers
- Metered TURN servers
- Additional public STUN servers

Total: 20+ servers for maximum connectivity behind NAT/Firewalls.

## Database Schema

The app uses the following tables:
- `users` - User profiles
- `conversations` - Chat conversations
- `conversation_participants` - Conversation members
- `messages` - Chat messages
- `message_reactions` - Message reactions
- `message_reads` - Read receipts
- `typing_indicators` - Typing status

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and key in `.env`
- Check that RLS policies are set up correctly
- Ensure the database schema is created

### Authentication Issues
- Verify Google OAuth credentials if using Google login
- Check Supabase Auth settings
- Ensure redirect URLs are configured

### Real-time Not Working
- Check Supabase Realtime is enabled
- Verify you're subscribed to the correct channels
- Check browser console for errors

### WebRTC Calls Not Connecting
- Verify STUN/TURN servers are accessible
- Check browser permissions for camera/microphone
- Ensure HTTPS is used (required for WebRTC)

## Next Steps

1. Customize the UI colors in `tailwind.config.js`
2. Add more emoji reactions
3. Implement group chat creation UI
4. Add message search functionality
5. Implement message forwarding UI
6. Add file preview modals
7. Implement call history

## Support

For issues, check:
- Supabase documentation: https://supabase.com/docs
- React documentation: https://react.dev
- WebRTC documentation: https://webrtc.org

