# Important for any new change made/added:

Always consider the overall architecture, high level design and the users goal and vision. And always keep the approach as simple as possible.

# Copy-Paste Prompt after adding new features and entries in a new chat:

"appending to /Users/gregorlederer/Local_Files_Business/MVP_v2/app/README.md:Summarize the changes we made to the codebase, considering architectural adjustments, changes, additions and everything else a developer needs to know to pick up where you left off just by reading the README.md"

# MVP v2 - Next.js + Supabase

A Next.js 16 application with Supabase authentication, deployed to https://member.m246.org

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase
- **Deployment**: PM2 on Ubuntu server via SSH

## Project Structure

```
src/
├── app/
│   ├── auth/actions.ts      # Server actions: login, signup, signout
│   ├── login/page.tsx       # Login page
│   ├── signup/page.tsx      # Signup page
│   ├── dashboard/page.tsx   # Protected dashboard
│   └── page.tsx             # Landing page
├── middleware.ts            # Auth middleware (session refresh + route protection)
└── utils/supabase/
    ├── client.ts            # Browser Supabase client
    ├── server.ts            # Server Supabase client
    └── middleware.ts        # Session handling utilities
```

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deployment

Deploy to production with:
```bash
./deploy.sh
```

**Server Details:**
| Setting | Value |
|---------|-------|
| Host | 152.53.249.242 |
| User | lederer |
| Path | /home/lederer/mvp2 |
| Port | 3002 |
| URL | https://member.m246.org |
| Process | PM2 (name: mvp2) |

**Manual PM2 commands (on server):**
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /home/lederer/mvp2
npx pm2 status
npx pm2 logs mvp2
npx pm2 restart mvp2
```

## Auth Flow

1. Unauthenticated users can access `/`, `/login`, `/signup`
2. `/dashboard` is protected - redirects to `/login` if not authenticated
3. Middleware refreshes sessions on every request
4. Server actions handle sign up/in/out with Supabase
