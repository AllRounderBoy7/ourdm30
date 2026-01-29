# 📁 Ultra Chat App - Complete File Structure

## 🗂️ Project Root Directory

```
kkk/                          ← Project Root Folder
│
├── 📄 package.json           ← Dependencies & Scripts
├── 📄 vite.config.ts         ← Vite Configuration
├── 📄 tsconfig.json          ← TypeScript Config
├── 📄 tailwind.config.js     ← Tailwind CSS Config
├── 📄 postcss.config.js      ← PostCSS Config
├── 📄 index.html             ← HTML Entry Point
├── 📄 .gitignore            ← Git Ignore Rules
├── 📄 .eslintrc.cjs         ← ESLint Config
├── 📄 .env                  ← Environment Variables (YOU CREATE THIS)
│
├── 📄 README.md             ← Main Documentation
├── 📄 SETUP.md              ← Setup Guide
├── 📄 FEATURES.md           ← Features List
├── 📄 FILE_STRUCTURE.md     ← This File
├── 📄 supabase-setup.sql    ← Database Schema
│
└── 📁 src/                  ← Source Code Folder
```

---

## 📂 src/ Folder Structure

```
src/
│
├── 📄 main.tsx              ← App Entry Point (React starts here)
├── 📄 App.tsx               ← Main App Component
├── 📄 index.css             ← Global Styles
├── 📄 vite-env.d.ts        ← TypeScript Environment Types
│
├── 📁 components/           ← All UI Components
│   │
│   ├── 📁 Auth/
│   │   └── 📄 Login.tsx     ← Login/Signup Screen
│   │
│   ├── 📁 Chat/
│   │   ├── 📄 ConversationList.tsx    ← Chat List (Left Sidebar)
│   │   ├── 📄 MessageList.tsx        ← Messages Display
│   │   ├── 📄 MessageInput.tsx       ← Message Input Box
│   │   ├── 📄 MessageReactions.tsx   ← Emoji Reactions
│   │   ├── 📄 ChatHeader.tsx         ← Chat Top Bar
│   │   └── 📄 TypingIndicator.tsx   ← "Typing..." Indicator
│   │
│   ├── 📁 Call/
│   │   ├── 📄 CallScreen.tsx        ← Active Call UI
│   │   └── 📄 IncomingCall.tsx      ← Incoming Call Popup
│   │
│   ├── 📁 Layout/
│   │   ├── 📄 Sidebar.tsx           ← Main Sidebar
│   │   └── 📄 ChatView.tsx         ← Chat Area
│   │
│   └── 📄 ErrorBoundary.tsx         ← Error Handler
│
├── 📁 context/              ← State Management
│   ├── 📄 AuthContext.tsx          ← Authentication State
│   ├── 📄 ChatContext.tsx          ← Chat & Messages State
│   └── 📄 ThemeContext.tsx         ← Dark/Light Mode
│
├── 📁 hooks/                ← Custom React Hooks
│   └── 📄 useOnlineStatus.ts        ← Online Status Tracker
│
└── 📁 lib/                  ← Utilities & Configs
    ├── 📄 supabase.ts              ← Supabase Client Setup
    ├── 📄 webrtc.ts                ← WebRTC Configuration (20+ STUN/TURN)
    ├── 📄 utils.ts                 ← Helper Functions
    ├── 📄 constants.ts             ← App Constants
    └── 📄 conversationHelpers.ts   ← Conversation Utilities
```

---

## 📋 File Details & Purpose

### 🎯 Root Level Files

| File | Purpose |
|------|---------|
| `package.json` | All npm packages & scripts |
| `vite.config.ts` | Build tool configuration |
| `tsconfig.json` | TypeScript settings |
| `tailwind.config.js` | Tailwind CSS theme |
| `.env` | **YOU CREATE THIS** - Supabase credentials |
| `index.html` | HTML template |

### 🎨 Components (`src/components/`)

| Component | Location | What It Does |
|-----------|----------|--------------|
| **Login** | `Auth/Login.tsx` | Google OAuth + Email/Password login |
| **ConversationList** | `Chat/ConversationList.tsx` | Shows all chats (left sidebar) |
| **MessageList** | `Chat/MessageList.tsx` | Displays messages |
| **MessageInput** | `Chat/MessageInput.tsx` | Text input + emoji + voice + files |
| **MessageReactions** | `Chat/MessageReactions.tsx` | Shows emoji reactions on messages |
| **ChatHeader** | `Chat/ChatHeader.tsx` | Top bar with call buttons |
| **TypingIndicator** | `Chat/TypingIndicator.tsx` | "User is typing..." animation |
| **CallScreen** | `Call/CallScreen.tsx` | Active call interface |
| **IncomingCall** | `Call/IncomingCall.tsx` | Incoming call popup |
| **Sidebar** | `Layout/Sidebar.tsx` | Left sidebar with user info |
| **ChatView** | `Layout/ChatView.tsx` | Main chat area container |
| **ErrorBoundary** | `ErrorBoundary.tsx` | Catches & displays errors |

### 🔄 Context (`src/context/`)

| Context | Purpose |
|---------|---------|
| `AuthContext.tsx` | Manages user login/logout state |
| `ChatContext.tsx` | Handles messages, conversations, real-time updates |
| `ThemeContext.tsx` | Dark/Light mode toggle |

### 🛠️ Utilities (`src/lib/`)

| File | Purpose |
|------|---------|
| `supabase.ts` | Supabase database connection |
| `webrtc.ts` | WebRTC calling setup (20+ servers) |
| `utils.ts` | Helper functions (format time, compress images, etc.) |
| `constants.ts` | App constants (max file size, emoji list, etc.) |
| `conversationHelpers.ts` | Functions to create conversations |

### 🎣 Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useOnlineStatus.ts` | Tracks if user is online/offline |

---

## 🗺️ Visual File Map

```
📦 kkk (Project Root)
│
├── 📄 Configuration Files (Root)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env (YOU CREATE)
│
├── 📄 Documentation Files (Root)
│   ├── README.md
│   ├── SETUP.md
│   ├── FEATURES.md
│   └── FILE_STRUCTURE.md (This file)
│
└── 📁 src/ (All Code Here)
    │
    ├── 📄 Entry Files
    │   ├── main.tsx (Starts React)
    │   ├── App.tsx (Main Component)
    │   └── index.css (Styles)
    │
    ├── 📁 components/ (UI Components)
    │   ├── Auth/ → Login.tsx
    │   ├── Chat/ → 6 files (messages, input, etc.)
    │   ├── Call/ → 2 files (call screens)
    │   ├── Layout/ → 2 files (sidebar, chat view)
    │   └── ErrorBoundary.tsx
    │
    ├── 📁 context/ (State Management)
    │   ├── AuthContext.tsx
    │   ├── ChatContext.tsx
    │   └── ThemeContext.tsx
    │
    ├── 📁 hooks/ (Custom Hooks)
    │   └── useOnlineStatus.ts
    │
    └── 📁 lib/ (Utilities)
        ├── supabase.ts
        ├── webrtc.ts
        ├── utils.ts
        ├── constants.ts
        └── conversationHelpers.ts
```

---

## 🔍 Quick File Finder

### "Where is the login screen?"
→ `src/components/Auth/Login.tsx`

### "Where are messages displayed?"
→ `src/components/Chat/MessageList.tsx`

### "Where is the message input box?"
→ `src/components/Chat/MessageInput.tsx`

### "Where is Supabase connection?"
→ `src/lib/supabase.ts`

### "Where is WebRTC calling setup?"
→ `src/lib/webrtc.ts`

### "Where is chat state managed?"
→ `src/context/ChatContext.tsx`

### "Where is authentication handled?"
→ `src/context/AuthContext.tsx`

### "Where is the main app?"
→ `src/App.tsx`

### "Where does React start?"
→ `src/main.tsx`

---

## 📝 Important Notes

1. **`.env` file** - आपको manually create करना होगा (security के लिए)
2. **`supabase-setup.sql`** - Supabase SQL Editor में run करें
3. **All code** - `src/` folder में है
4. **Components** - `src/components/` में organized हैं
5. **Configuration** - Root folder में है

---

## 🚀 File Count Summary

- **Total Files**: 30+
- **Components**: 15+
- **Contexts**: 3
- **Hooks**: 1
- **Utilities**: 5+
- **Config Files**: 6+

---

यह structure easy to understand और maintainable है!

