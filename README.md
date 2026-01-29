# Ultra Chat - Real-time Chat & Calling App

A full-stack, production-ready real-time chat and calling application built with React, Supabase, and WebRTC.

## Features

### Real-time Communication
- ✅ Real-time messaging with Supabase Realtime
- ✅ Typing indicators
- ✅ Read receipts (Blue ticks)
- ✅ Online/Last seen status
- ✅ Message reactions with emoji picker
- ✅ Reply/Forward functionality
- ✅ Pin chats
- ✅ Mute notifications

### Media Sharing
- ✅ Drag & Drop file sharing
- ✅ Image compression before upload
- ✅ Voice notes with recording
- ✅ File attachments

### Calling
- ✅ Professional Voice & Video calling UI
- ✅ WebRTC implementation with 20+ STUN/TURN servers
- ✅ Call controls (mute, video toggle, fullscreen)

### UI/UX
- ✅ Instagram/WhatsApp DM style UI
- ✅ Glassmorphism design
- ✅ Dark/Light mode toggle
- ✅ Optimized rendering with virtualization
- ✅ Zero lag performance

### Authentication
- ✅ Google OAuth (Primary)
- ✅ Email/Password fallback
- ✅ Seamless authentication flow

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage, Realtime)
- **Calling**: WebRTC
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **PWA**: Vite PWA Plugin

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ultra-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API and copy your URL and anon key
   - Create a `.env` file in the root directory:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up Supabase Database**
   
   Run these SQL commands in your Supabase SQL Editor:

   ```sql
   -- Enable necessary extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Users table (extends auth.users)
   CREATE TABLE IF NOT EXISTS public.users (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     email TEXT NOT NULL,
     full_name TEXT NOT NULL,
     avatar_url TEXT,
     online BOOLEAN DEFAULT false,
     last_seen TIMESTAMPTZ DEFAULT NOW(),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Conversations table
   CREATE TABLE IF NOT EXISTS public.conversations (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
     name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Conversation participants
   CREATE TABLE IF NOT EXISTS public.conversation_participants (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     pinned BOOLEAN DEFAULT false,
     muted BOOLEAN DEFAULT false,
     last_read_at TIMESTAMPTZ,
     joined_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(conversation_id, user_id)
   );

   -- Messages table
   CREATE TABLE IF NOT EXISTS public.messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
     sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'voice', 'video')),
     media_url TEXT,
     reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
     forwarded_from UUID REFERENCES auth.users(id) ON DELETE SET NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Message reactions
   CREATE TABLE IF NOT EXISTS public.message_reactions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     emoji TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(message_id, user_id)
   );

   -- Message reads
   CREATE TABLE IF NOT EXISTS public.message_reads (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     read_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(message_id, user_id)
   );

   -- Typing indicators
   CREATE TABLE IF NOT EXISTS public.typing_indicators (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     is_typing BOOLEAN DEFAULT false,
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(conversation_id, user_id)
   );

   -- Create indexes for performance
   CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);
   CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
   CREATE INDEX IF NOT EXISTS idx_message_reads_message_user ON public.message_reads(message_id, user_id);
   CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation ON public.typing_indicators(conversation_id);

   -- Enable Row Level Security
   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
   CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT 
     USING (id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));
   
   CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT 
     WITH CHECK (auth.uid() = created_by);

   CREATE POLICY "Users can view own participants" ON public.conversation_participants FOR SELECT 
     USING (user_id = auth.uid() OR conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));

   CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT 
     USING (conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));

   CREATE POLICY "Users can send messages" ON public.messages FOR INSERT 
     WITH CHECK (auth.uid() = sender_id AND conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));

   CREATE POLICY "Users can view own reactions" ON public.message_reactions FOR SELECT 
     USING (message_id IN (SELECT id FROM public.messages WHERE conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())));

   CREATE POLICY "Users can manage own reactions" ON public.message_reactions FOR ALL 
     USING (user_id = auth.uid());

   CREATE POLICY "Users can view own reads" ON public.message_reads FOR SELECT 
     USING (message_id IN (SELECT id FROM public.messages WHERE conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())));

   CREATE POLICY "Users can manage own reads" ON public.message_reads FOR ALL 
     USING (user_id = auth.uid());

   CREATE POLICY "Users can view typing indicators" ON public.typing_indicators FOR SELECT 
     USING (conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()));

   CREATE POLICY "Users can manage own typing" ON public.typing_indicators FOR ALL 
     USING (user_id = auth.uid());

   -- Function to create user profile on signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.users (id, email, full_name, avatar_url)
     VALUES (
       NEW.id,
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
       NEW.raw_user_meta_data->>'avatar_url'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Trigger to create user profile
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

   -- Function to update user online status
   CREATE OR REPLACE FUNCTION public.update_user_online_status()
   RETURNS TRIGGER AS $$
   BEGIN
     UPDATE public.users
     SET online = true, last_seen = NOW()
     WHERE id = NEW.id;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

5. **Set up Storage**
   - Go to Storage in Supabase dashboard
   - Create a new bucket named `media`
   - Set it to public
   - Add policy: Allow authenticated users to upload/read

6. **Enable Google OAuth**
   - Go to Authentication > Providers in Supabase
   - Enable Google provider
   - Add your Google OAuth credentials

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.tsx
│   ├── Chat/
│   │   ├── ConversationList.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageReactions.tsx
│   │   ├── ChatHeader.tsx
│   │   └── TypingIndicator.tsx
│   ├── Call/
│   │   ├── CallScreen.tsx
│   │   └── IncomingCall.tsx
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   └── ChatView.tsx
│   └── ErrorBoundary.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── ChatContext.tsx
│   └── ThemeContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── webrtc.ts
│   ├── utils.ts
│   └── constants.ts
├── App.tsx
├── main.tsx
└── index.css
```

## WebRTC Configuration

The app includes 20+ STUN/TURN servers for maximum connectivity:
- Google STUN servers (5 servers)
- Twilio STUN/TURN servers
- Mozilla STUN
- Open Relay Project TURN servers
- Metered TURN servers
- Additional public STUN servers

## Features in Detail

### Real-time Features
- Messages sync instantly across all devices
- Typing indicators show when users are typing
- Read receipts with blue double ticks
- Online status updates in real-time

### Media Handling
- Images are automatically compressed before upload
- Drag & drop support for easy file sharing
- Voice notes with recording capability
- File previews and downloads

### Social Features
- React to messages with emojis
- Reply to specific messages
- Forward messages to other conversations
- Pin important conversations
- Mute notifications per conversation

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on the repository.

