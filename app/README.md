# High Level Operations

**Important for any new change made/added by any human or machine working in this codebase:**

Always consider the overall architecture, high level design and the users goal and vision. And always keep the approach as simple as possible.

**For user: Copy-Paste Prompt after adding new features and entries in a new chat:**

"appending to /Users/gregorlederer/Local_Files_Business/MVP_v2/app/README.md:Summarize the changes we made to the codebase, considering architectural adjustments, changes, additions and everything else a developer needs to know to pick up where you left off just by reading the README.md"

"before commiting, please ensure the readme properly represents the current architecture and everything in there is 100% true and 100% up to date."

---

# Git Essentials

**Daily Workflow:**
```bash
git status                    # See what changed
git add .                     # Stage all changes
git commit -m "description"   # Commit with message
git push                      # Push to GitHub
```

**Pull Latest (from another machine or after changes on GitHub):**
```bash
git pull
```

**View History:**
```bash
git log --oneline -10         # Last 10 commits, compact view
git log -p -1                 # Last commit with full diff
```

**Emergency Rollbacks:**
```bash
# Undo last commit (keep changes in working dir)
git reset --soft HEAD~1

# Undo last commit (discard changes completely) ⚠️
git reset --hard HEAD~1

# Revert a specific commit (creates new commit that undoes it - safe for pushed commits)
git revert <commit-hash>

# Discard all local changes (go back to last commit) ⚠️
git checkout -- .
```

**Branching (for features/experiments):**
```bash
git checkout -b feature-name  # Create & switch to new branch
git checkout main             # Switch back to main
git merge feature-name        # Merge feature into current branch
git branch -d feature-name    # Delete branch after merge
```

**Fixing Mistakes:**
```bash
# Amend last commit message
git commit --amend -m "new message"

# Add forgotten files to last commit
git add forgotten-file.ts
git commit --amend --no-edit
```

**GitHub Repo:** https://github.com/coffeeandcoffee/m246_mvp_v2

---

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

---

## Changelog

### 2025-12-10: GitHub Setup & Documentation

**Changes Made:**

1. **Created root `.gitignore`** at `/MVP_v2/.gitignore`
   - Excludes `node_modules/`, `.env.local`, `.next/`, `.DS_Store`, and other build artifacts
   - Protects sensitive environment variables from being committed

2. **Fixed nested Git repository issue**
   - Removed embedded `.git` folder from `app/` (left over from `create-next-app`)
   - This ensures the entire project is tracked as a single repository

3. **Initialized GitHub repository**
   - Remote: https://github.com/coffeeandcoffee/m246_mvp_v2
   - Branch: `main`
   - All 28 project files committed and pushed

4. **Added Git Essentials section to README**
   - Daily workflow commands
   - Emergency rollback procedures
   - Branching and fixing mistakes

**No code/architecture changes** - this session focused purely on version control setup and documentation.
