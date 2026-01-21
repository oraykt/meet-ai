meet-ai — Tech Stack

This project uses the following technologies and libraries:

## Core Framework & UI

- **Next.js 15.3.8** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** (with @tailwindcss/postcss)
- **PostCSS**
- **Turbopack** (dev server)
- **ESLint** (eslint-config-next)

## UI Component Libraries

- **Radix UI** - Unstyled, accessible component primitives
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide React** - Beautiful icons
- **class-variance-authority** - Type-safe component variants
- **tailwind-merge** - Utility for merging Tailwind CSS classes
- **clsx** - Utility for constructing className strings

## Form & Validation

- **React Hook Form** - Performant, flexible form validation
- **Zod** - TypeScript-first schema validation
- **Zod-to-JSON-Schema** - Convert Zod schemas to JSON schemas

## Backend & Database

- **Drizzle ORM** - TypeScript ORM for PostgreSQL
- **PostgreSQL** - Primary database
- **Better Auth** - Modern authentication library with OAuth support

## API & Communication

- **tRPC** - End-to-end typesafe APIs with TypeScript
- **@tanstack/react-query** - Server state management
- **@tanstack/react-table** - Headless table component

## Video & Chat SDKs

- **@stream-io/video-react-sdk** (v1.31.0) - Video conferencing with real-time capabilities
- **@stream-io/node-sdk** (v0.7.33) - Server-side Stream Video SDK
- **@stream-io/openai-realtime-api** (v0.3.3) - OpenAI Realtime API integration with Stream
- **stream-chat** - Server-side chat SDK
- **stream-chat-react** - React components for Stream Chat

## AI & Automation

- **OpenAI** (v6.16.0) - GPT models for AI responses and transcription processing
- **Inngest** (v3.49.1) - Event-driven background job processing
- **@inngest/agent-kit** (v0.13.2) - Agent framework for Inngest
- **Inngest CLI** - Development server for Inngest workflows

## Data & Utilities

- **date-fns** - Modern date utility library
- **humanize-duration** - Convert milliseconds to human-readable strings
- **nanoid** - Tiny, secure, URL-friendly unique ID generator
- **input-otp** - Headless OTP input component
- **react-error-boundary** - Error boundary component for React
- **react-markdown** - Markdown renderer for React
- **react-resizable-panels** - Resizable panel components
- **react-highlight-words** - Highlight words in text
- **react-use** - React hooks utilities
- **Recharts** - Composable charting library
- **Sonner** - Toast notifications
- **DiceBear** - Avatar generation service
- **Embla Carousel** - Carousel/slider component
- **JSONL Parse & Stringify** - JSON Lines format utilities
- **Nuqs** - Type-safe search params for Next.js
- **next-themes** - Dark mode support

## Development Tools

- **dotenv** - Environment variable management

Dev dependencies are managed via npm. Update `package.json` for exact versions.

## UI Pages

### Authentication Pages

#### Sign In Page

![Sign In Page](/public/README/SignIn.png)

**Features:**

- Email and password form fields with validation
- Field-level error messages powered by `react-hook-form` and `zod`
- "Remember me" checkbox
- "Forgot password?" link
- Link to create a new account
- OAuth provider buttons (Google, GitHub)
- Responsive design with branded side panel

**Supported Methods:**

- Email/Password authentication via `authClient.signIn.email()`
- OAuth (Google, GitHub) via `authClient.signIn.social()`

#### Sign Up Page

![Sign Up Page](/public/README/SignUp.png)

**Features:**

- Form fields: Full Name, Email, Password, Confirm Password
- Password confirmation validation (zod refine ensures match)
- Field-level error messages with `FormMessage`
- Form-level error alert display
- OAuth provider buttons (Google, GitHub)
- Link to existing account sign in
- Responsive design with branded side panel

**Supported Methods:**

- Email/Password registration via `authClient.signUp.email()`
- OAuth (Google, GitHub) via `authClient.signIn.social()`

**Form Validation (Zod Schema):**

```typescript
const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, { message: "Password should be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

#### Dashboard & Agents

The Dashboard and Agents pages are implemented (see `src/app/dashboard` and related agents routes). These pages provide an interface for managing agents and viewing dashboard data within the app.

#### Responsive Layout

- **Responsive Layout:** A responsive layout pattern is used to adapt the UI for mobile and desktop. The app uses the `useIsMobile` hook to switch UI components (for example, Drawer on mobile and Dialog on desktop) to improve usability across screen sizes.

## Core Features

### Video Meetings with AI Integration

The application provides real-time video conferencing capabilities with integrated AI assistance. Key features include:

#### Video SDK Integration

- **Stream Video SDK** powers video conferencing with call management
- **OpenAI Realtime API** integration for live AI responses
- Real-time transcription of call participants
- Call recording and transcript URL storage
- Automatic meeting status tracking (upcoming → active → completed)

#### AI Agent Participation

- **AI Agents** participate directly in video calls as virtual participants
- Agents follow custom instructions defined per agent
- Real-time conversation using OpenAI's Realtime API
- Agents can understand and respond to meeting context
- Support for multiple agents with different instruction sets

#### Call Lifecycle Management

- **Session Start**: When a call begins, the system:
  - Verifies the meeting exists and is in "upcoming" status
  - Updates status to "active" and records start time
  - Initializes the OpenAI Realtime client
  - Loads agent instructions for the conversation
- **Session End**: When participants leave:
  - Tracks when agent and participants leave
  - Updates meeting status accordingly
  - Triggers transcription processing
- **Recording & Transcription**:
  - Automatic call recording by Stream
  - Webhook notifications when recording is ready
  - Transcript generation with URL storage
  - Ready for post-meeting summary generation

### Webhook Integration

The application uses Stream webhooks (`/api/webhook`) to handle real-time events:

- **call.session_started**: Initializes AI agent when call begins
- **call.session_participant_left**: Tracks participant departures
- **call.recording_ready**: Stores recording URL when available
- **call.transcription_ready**: Triggers meeting transcription processing

### Meeting Transcription & AI Summarization

#### Automated Processing with Inngest

The application uses **Inngest** for event-driven background processing:

- **Event-Driven Architecture**: Transcription ready events trigger processing workflows
- **Distributed Background Jobs**: Scalable processing of transcripts
- **Type-Safe Function Definitions**: Inngest functions with full TypeScript support

#### Transcript Processing Workflow

When a call transcription is ready:

1. **Fetch Transcript**: Downloads the JSONL transcript from Stream
2. **Parse Transcript**: Converts JSONL format to TypeScript objects
3. **Enrich with Speaker Info**:
   - Identifies speaker IDs (users and agents)
   - Queries database for speaker names
   - Merges speaker information with transcript items
4. **AI Summarization**:
   - Uses **Inngest Agent Kit** with OpenAI GPT-4o
   - Custom summarizer agent processes the enhanced transcript
   - Generates markdown-formatted summaries with:
     - **Overview**: Detailed narrative summary of the meeting
     - **Notes**: Thematic sections with timestamps and key points
5. **Save Results**: Stores summary in database and updates meeting status to "completed"

#### Summarizer Agent

- **Model**: GPT-4o from OpenAI
- **Role**: Expert summarizer creating readable, concise content
- **Output Format**: Structured markdown with overview and timestamped notes
- **Context Aware**: Includes entire transcript for comprehensive understanding

### Chat with AI (Post-Meeting)

After a meeting is completed, users can chat with the AI agent about the meeting:

#### Stream Chat Integration

- **Stream Chat SDK** provides real-time messaging infrastructure
- Channels are created per meeting for persistent conversations
- Webhook integration (`/api/chat-webhook`) handles incoming messages

#### Intelligent Response System

- Messages from users trigger AI responses via OpenAI's Chat API
- **Context from Meeting**:
  - AI references the meeting summary
  - Follows original agent instructions
  - Provides consistent behavior with live meeting agent
- **Smart Processing**:
  - Duplicate message detection prevents multiple responses
  - Only responds to user messages (ignores agent responses)
  - Maintains conversation history in Stream Chat

#### Chat Message Flow

1. User sends message via Stream Chat
2. Webhook receives `message.new` event
3. System checks if message already processed
4. Verifies meeting is completed
5. Retrieves meeting context and agent instructions
6. Calls OpenAI to generate response
7. Creates/upserts agent user in Stream Chat
8. Sends response back to channel
9. Marks message as processed

### TRPC API Layer

The application uses **tRPC** for end-to-end typesafe APIs:

#### Architecture

- **Server Context**: User authentication and database access via `createTRPCContext`
- **Protected Procedures**: `protectedProcedure` verifies user authentication
- **Router Organization**: Modular routers for agents and meetings
- **Integration**: Full TypeScript type safety between client and server

#### Routers

- **Agents Router** (`src/pages/agents/server/procedures`): Agent management operations
- **Meetings Router** (`src/pages/meetings/server/procedures`): Meeting operations and queries

#### Server-Side Rendering

- **tRPC Server Functions**: Direct server function calls with `caller`
- **React Query Integration**: Built-in caching and hydration
- **Dehydration**: Server-rendered state passed to client via `HydrationBoundary`

### Authentication

The application uses **Better Auth** for secure authentication:

- **Email/Password Authentication**: Local user account creation and login
- **OAuth Integration**: Support for Google and GitHub
- **PostgreSQL Backend**: User sessions and credentials stored securely
- **Session Management**: Token-based session tracking with expiration
- **Account Linking**: Support for multiple provider accounts per user

### Database Schema

The PostgreSQL database includes:

- **Users**: Core user information with OAuth account linking
- **Sessions**: Active user sessions with IP and User-Agent tracking
- **Accounts**: OAuth provider credentials and tokens
- **Verification**: Email verification and password reset tokens
- **Agents**: AI agent configurations with custom instructions
- **Meetings**: Meeting records with status, timestamps, transcripts, and recordings
- **Processed Chat Messages**: Tracking to prevent duplicate message processing

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server with Turbopack
npm run dev:webhook     # Start webhook tunnel with ngrok
npm run dev:inngest     # Start Inngest dev server for local testing

# Production
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio for database inspection

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
```

## Environment Variables

Required environment variables for full functionality:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/meetai
PGDB_USER=user
PGDB_PASSWORD=password
PGDB_HOST=localhost
PGDB_NAME=meetai

# Authentication
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Video & Chat SDKs
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your_stream_video_api_key
STREAM_VIDEO_SECRET_KEY=your_stream_video_secret_key
NEXT_PUBLIC_STREAM_CHAT_API_KEY=your_stream_chat_api_key
STREAM_CHAT_SECRET_KEY=your_stream_chat_secret_key

# AI
OPENAI_API_KEY=your_openai_api_key

# Inngest
INNGEST_SIGNING_KEY=your_inngest_signing_key (for production)
```

## Architecture Overview

### Request Flow

1. **Authentication**: Better Auth handles user signup/login with OAuth
2. **Video Calls**: Stream Video SDK manages peer connections and recording
3. **AI Participation**: OpenAI Realtime API drives live agent responses
4. **Webhooks**: Stream sends events (session_started, transcription_ready, etc.)
5. **Background Processing**: Inngest processes events asynchronously
6. **AI Summarization**: GPT-4o summarizes transcripts via Inngest agents
7. **Post-Meeting Chat**: Stream Chat enables continued conversation with context

### Data Flow

```
Video Call (Stream)
  ↓ Webhook Events
Stream Webhook Endpoint (/api/webhook)
  ↓ Trigger Events
Inngest Processing
  ↓ Background Jobs
AI Summarization (GPT-4o)
  ↓ Save Results
Database (PostgreSQL)
  ↓ Retrieve for Chat
Chat Context (Stream Chat)
```
