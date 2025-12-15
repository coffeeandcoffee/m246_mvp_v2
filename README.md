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

---

# Product Vision (v2025-12-13)

> **Core Mission**: Help entrepreneurs increase their "Execution Flow Days" — days of confident, doubt-free, focused execution — through daily structured sequences and behavioral tracking.

## I. Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Elite Minimalism** | Black/dark background, fine lines, white/gray text |
| **Frictionless UX** | Single action per page, maximum one sentence |
| **Zero Overwhelm** | Strip away everything not essential |
| **Personalized Truth** | Use user's name, data, timezone — never generic |

## II. Feedback Loop System

Every page includes a small gray underlined "help/error/stuck" link:

- **Logged**: Click events tracked per user + page for friction analysis
- **Popup**: 3 options that open WhatsApp with prefilled messages:
  - `help` → `I need help (pageid:xxx)...`
  - `error` → `I encountered error (pageid:xxx)...`
  - `stuck` → `I am stuck (pageid:xxx)...`
- **Support Number**: `+49 152 59495693`

## III. Auth & Signup Flow

```
Unauthenticated → /login (email + password)
                    ↓
              "Don't have an account?"
                    ↓
              /signup (email + password + invite code)
                    ↓
              Validate invite code → Create user
                    ↓
              Auto-create profile + 4 referral codes
                    ↓
              First login → Onboarding sequence
```

**Invite Codes**:
- Universal: `M246MVP` (toggleable, unlimited use)
- Referral: 4 unique 8-char codes per user (single-use)

## IV. Sequence Logic

### State Machine

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER STATE FLOW                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  NOT ONBOARDED ──────────► ONBOARDING SEQUENCE                   │
│        │                         │                               │
│        │                         ▼                               │
│        │                  onboarded = TRUE                       │
│        │                         │                               │
│        │                         ▼                               │
│        │              ┌─────────────────────┐                    │
│        │              │ No evening complete │──► EVENING SEQ     │
│        │              │    on any day?      │    (first time)    │
│        │              └─────────────────────┘                    │
│        │                         │                               │
│        ▼                         ▼                               │
│  ┌───────────────────────────────────────────┐                   │
│  │          DAILY SEQUENCE ROUTER            │                   │
│  │                                           │                   │
│  │  Time < 3am? → Yesterday's EVENING SEQ    │                   │
│  │  Time ≥ 3am AND before reflection time?   │                   │
│  │              → MORNING SEQ                │                   │
│  │  Time ≥ reflection time?                  │                   │
│  │              → EVENING SEQ                │                   │
│  └───────────────────────────────────────────┘                   │
│                                                                  │
│  Resume exactly where user left off (page + path choices)        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Key Rules

1. **Onboarding**: Once per user lifetime, day-unspecific progress
2. **Morning**: Once per day, active from 3am in user timezone
3. **Evening**: Once per day, active after user-defined reflection time
4. **Night Owl**: Midnight–3am counts as previous day's evening
5. **Backfill**: If yesterday's evening empty, collect in morning (v1-m-21)

## V. UXv1 Sequences

### V.i Onboarding Sequence (12 pages)

| Page | Content | Collects |
|------|---------|----------|
| `v1-o-1` | "How can we call you?" | `user_name` |
| `v1-o-2` | "Is this your correct Timezone?" (prefilled from IP) | `user_timezone` |
| `v1-o-3` | "Do you remember the last day you did not overthink...?" | `remembers_efd` (yes/no → branch) |
| `v1-o-4` | [if yes] "When was this day?" | `last_efd_date` |
| `v1-o-5` | "We call such days Execution Flow Days." | — |
| `v1-o-6` | "Those days feel really good..." | — |
| `v1-o-7` | "Once such a special day is over..." | — |
| `v1-o-8` | "Such days cause you to:" (checklist animation) | — |
| `v1-o-9` | "Our goal is to help you increase..." | — |
| `v1-o-10` | "Successful entrepreneurs achieve up to 20/month" | — |
| `v1-o-11` | [if date known] "Your last EFD was [DATE]..." | — |
| `v1-o-12` | [if date unknown] "You couldn't remember..." | — |

**After onboarding** → Forward to Evening Sequence (skip first morning)

**Implementation Notes:**
- `v1-o-2`: Prefill timezone from browser's `Intl.DateTimeFormat().resolvedOptions().timeZone`

### V.ii Morning Sequence (22 pages)

| Page | Content | Collects |
|------|---------|----------|
| `v1-m-1` | "Step #1" ✓ "NAME, you showed up. Well done." | — |
| `v1-m-2` | Checkbox: "I will not open other apps..." [Commit] | — |
| `v1-m-3` | "Step #2: Put headphones in." [Done] | — |
| `v1-m-4` | "Now we get your brain into the right state..." | — |
| `v1-m-5`–`v1-m-11` | "Read Carefully:" mental preparation slides | — |
| `v1-m-12` | Audio player with progress bar (80% unlock) | `audio_play` event |
| `v1-m-13` | "Step #2 = DONE" (personalized compliment) | — |
| `v1-m-14` | "You can listen to your audio anytime..." | — |
| `v1-m-15` | "Step #3" 2/3 progress | — |
| `v1-m-16` | "The Magic Task" (text input) | `magic_task` |
| `v1-m-17` | Display task, "Focus only on this" [Task Done] | `magic_task_completed` |
| `v1-m-18` | "Step #3 = DONE" 3/3 (personalized) | — |
| `v1-m-19` | "When for 5-min reflection?" (time picker) | `evening_reflection_time` |
| `v1-m-20` | "Set alarm on your phone" | — |
| `v1-m-21` | [if yesterday empty] "We missed yesterday's reflection" → backfill | — |
| `v1-m-22` | Final page: summary + feature links + audio player | `link_click` events |

**Audio Player (v1-m-12) Requirements:**
- Play/pause button with progress bar
- **[Next] button locked - NOT until 80% of audio played - but until 80% of audio duration since visit of page timestemp has passed - making it independent of users speed or audio player state - only dependent on time as single source of truth**
- Lock screen play/pause support (mobile)
- Loads user's custom audio (latest version) or default audio

**Time Picker (v1-m-19) Prefill:**
- Prefill with previous day's reflection time if available
- If unavailable default to 18:00 for user

**Feature Links (v1-m-22):**
Each link leads to a placeholder page with:
- "Coming soon" message
- The heading is equal to the link name they clicked to get to the page
- Text field: "This feature is in development. \nNAME, in your opinion, what would be helpful to see/have here? Suggest it - and see it implemented!"
- Submit → confirmation → saves to `feature_suggestions` table

**Feature Links** (tracked):
- Scientific Background of the M246-Program
- Join a Community Call
- Get an Accountability Partner
- Get more structure in my day
- Invite-Link for my Friends join M246
- Edit my Reality-Defining Audio

### V.iii Evening Sequence (14 pages)

| Page | Content | Collects |
|------|---------|----------|
| `v1-e-1` | "Your 5-min reflection is ready..." | — |
| `v1-e-2` | "Will you commit to open this app tomorrow?" [Commit]/[Day off] | `committed_tomorrow`, `taking_day_off` → branch |
| `v1-e-3` | [if day off] "Good, taking a day off is important." | — |
| `v1-e-4` | "When will you return?" [Day after tomorrow]/[Later] | — |
| `v1-e-5` | [if later] Date picker | `return_date` |
| `v1-e-6` | "Commit to return on [WEEKDAY, DATE] morning?" [Commit] | — |
| `v1-e-7` | "How positive today?" (1–10) | `rating_positivity` |
| `v1-e-8` | "How confident?" (1–10) | `rating_confidence` |
| `v1-e-9` | "How much overthinking?" (1–10) | `rating_overthinking` |
| `v1-e-10` | "How much intuition?" (1–10) | `rating_intuition` |
| `v1-e-11` | "How much doubt?" (1–10) | `rating_doubt` |
| `v1-e-12` | "How happy?" (1–10) | `rating_happiness` |
| `v1-e-13` | "How quick were decisions?" (1–10) | `rating_decision_speed` |
| `v1-e-14` | "Great job NAME. See you [DATE]." — shows "tomorrow" only if returning next day | — |

**Rating Scale Labels** (shown under the "10"):

| Rating | 10 = Label |
|--------|------------|
| Positivity | "I felt fantastic" |
| Confidence | "Very confident" |
| Overthinking | "Lots of overthinking & hesitation" |
| Intuition | "Very much" |
| Doubt | "Lots of doubt" |
| Happiness | "Very happy" |
| Decision Speed | "Very fast" |

## VI. Time & Sequence Logic (Critical for Implementation)

> **For Developers**: This section documents ALL time-based and sequence-based conditions that control which screens users see. Understanding this is essential before implementing any sequence.

### VI.i State Determination Flow

When a user logs in or returns to the app, the system must determine what to show them:

```
USER RETURNS
    │
    ▼
┌───────────────────┐
│ Is onboarded?     │───NO───► ONBOARDING SEQUENCE
└────────┬──────────┘          (resume where left off)
         │YES
         ▼
┌───────────────────────────┐
│ Has EVER completed an     │───NO───► EVENING SEQUENCE
│ evening sequence?         │          (first time, today)
└────────┬──────────────────┘
         │YES
         ▼
┌───────────────────────────┐
│ What time is it in        │
│ user's timezone?          │
└────────┬──────────────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
MIDNIGHT–3AM                   3AM–REFLECTION TIME
    │                             │
    ▼                             ▼
Yesterday's EVENING       Today's MORNING SEQUENCE
(if not completed)             │
                               ▼
                    ┌──────────────────────┐
                    │ Yesterday's evening  │
                    │ completed?           │
                    └────────┬─────────────┘
                        YES  │  NO
                          ┌──┴──┐
                          │     │
                          ▼     ▼
                    Normal   Backfill yesterday
                    flow     at v1-m-21
                             
    ▼
AFTER REFLECTION TIME (user-defined, until 3am next day)
    │
    ▼
Today's EVENING SEQUENCE
```

### VI.ii Time Rules Summary

| Condition | Active Sequence | Notes |
|-----------|-----------------|-------|
| User not onboarded | Onboarding | Day-independent, tracked per user |
| Onboarded but never did evening | Evening | Skip first morning entirely |
| 3:00am – Reflection Time | Morning | Can only complete once per day |
| Reflection Time – 2:59am next day | Evening | Can only complete once per day |
| Midnight – 2:59am | Evening (YESTERDAY) | Night owl logic: counts as previous day |

### VI.iii Sequence Completion Rules

| Rule | Description |
|------|-------------|
| **Once per lifetime** | Onboarding can only be completed once ever |
| **Once per day** | Morning and evening each complete once per calendar day |
| **Resume exactly** | If user leaves mid-sequence, they resume at exact page |
| **Path choices persist** | Branching decisions (yes/no) are saved and restored |
| **Backfill yesterday only** | If yesterday's evening is empty, collect at v1-m-21. **Max 1 day back** — older days cannot be recovered and simply stay empty. (missed days) |
| **Skip first morning** | After onboarding → evening (not morning) |

### VI.iv Night Owl Logic (Midnight–3am)

This is **critical** for correct behavior:

```
If current time is between 00:00 and 02:59 in user's timezone:
  → Treat as "previous day" for evening sequence
  → User sees YESTERDAY's evening sequence (if not completed)
  → Data saves to YESTERDAY's daily_log
```

**Example**: User logs in at 1:30am on Tuesday
- They see Monday's evening sequence
- Their responses save to Monday's `daily_log`
- Tuesday's morning sequence activates at 3:00am Tuesday

### VI.v Progress Tracking Requirements

For **Onboarding** (day-independent):
- `sequence_progress.current_page_id` = current page
- `sequence_progress.path_choices` = JSON of branching decisions
- `sequence_progress.status` = `in_progress` or `completed`
- `daily_log_id` = NULL (not tied to any day)

For **Morning/Evening** (day-specific):
- Same fields but linked to specific `daily_log_id`
- `daily_logs` table has one row per user per day
- `metric_responses` link to `daily_log_id` for that day's data

### VI.vi Data That Must Be Collected

**Onboarding** (once per user):
- `user_name` (text)
- `user_timezone` (text)  
- `remembers_efd` (boolean) → creates branch
- `last_efd_date` (date, if remembers_efd = true)

**Morning** (daily):
- `magic_task` (text)
- `magic_task_completed` (boolean)
- `evening_reflection_time` (time)

**Evening** (daily):
- `committed_tomorrow` (boolean) → creates branch
- `taking_day_off` (boolean)
- `return_date` (date, if taking day off)
- `rating_positivity` (1-10)
- `rating_confidence` (1-10)
- `rating_overthinking` (1-10)
- `rating_intuition` (1-10)
- `rating_doubt` (1-10)
- `rating_happiness` (1-10)
- `rating_decision_speed` (1-10)

---

## VII. Testing Guide (For Developers)

> **IMPORTANT**: During development, you need to test sequences freely without time restrictions.

### VII.i Current Testing Approach (Manual)

Since time-based routing is **not yet implemented**, you can currently:

1. **Navigate directly to any page**: `http://localhost:3000/evening/1`
2. **Test each page independently**: No routing logic blocks you
3. **Verify database saves**: Check Supabase Dashboard after each action

### VII.ii When Time Logic IS Implemented

You'll need these workarounds:

#### Option A: Database Override (Recommended)
```sql
-- Reset user to test onboarding again
UPDATE user_profiles 
SET onboarded = false 
WHERE user_id = 'YOUR_USER_ID';

-- Clear today's sequence progress
DELETE FROM sequence_progress 
WHERE user_id = 'YOUR_USER_ID' 
AND daily_log_id = (
  SELECT id FROM daily_logs 
  WHERE user_id = 'YOUR_USER_ID' 
  AND date = CURRENT_DATE
);

-- Clear today's daily log entirely
DELETE FROM daily_logs 
WHERE user_id = 'YOUR_USER_ID' 
AND date = CURRENT_DATE;
```

#### Option B: Time Simulation (Future)
Add environment variable for testing:
```env
# In .env.local (NEVER in production)
NEXT_PUBLIC_DEV_TIME_OVERRIDE=2024-12-15T19:00:00
```

#### Option C: Direct URL Navigation
During development, pages don't enforce routing. Access directly:
- `/onboarding/1` through `/onboarding/12`
- `/evening/1` through `/evening/14`
- `/morning/1` through `/morning/22` (when built)

### VII.iii Verification Queries

**Check user state:**
```sql
SELECT 
  up.name,
  up.timezone,
  up.onboarded,
  up.created_at
FROM user_profiles up
WHERE up.user_id = auth.uid();
```

**Check sequence progress:**
```sql
SELECT 
  sp.status,
  sp.current_page_id,
  sp.path_choices,
  s.key as sequence_key,
  dl.date
FROM sequence_progress sp
JOIN sequences s ON s.id = sp.sequence_id
LEFT JOIN daily_logs dl ON dl.id = sp.daily_log_id
WHERE sp.user_id = 'YOUR_USER_ID'
ORDER BY sp.created_at DESC;
```

**Check evening responses for today:**
```sql
SELECT 
  m.key as metric_key,
  mr.value_int as rating,
  mr.value_text,
  mr.value_date,
  mr.created_at
FROM metric_responses mr
JOIN metrics m ON m.id = mr.metric_id
JOIN daily_logs dl ON dl.id = mr.daily_log_id
WHERE dl.user_id = 'YOUR_USER_ID'
AND dl.date = CURRENT_DATE
AND m.sequence_key = 'evening'
ORDER BY mr.created_at;
```

### VII.iv Testing Checklist Template

Use this for each sequence page:

```
□ Page loads without errors
□ UI matches design (black bg, white text, proper spacing)
□ Primary action works (button click, form submit)
□ Data saves to correct table (check Supabase)
□ Navigation goes to correct next page
□ Branching (if applicable) goes to correct path
□ Help/error/stuck popup works
□ Loading states show correctly
□ Error states show correctly
```

---

## IX. Architecture Principles

### Data vs. Pages Separation

```
┌─────────────────────────────────────────────────────────────┐
│  UXv1 Pages → UXv2 Pages → UXvN    (Frontend changes OK)   │
├─────────────────────────────────────────────────────────────┤
│               STABLE DATA LAYER                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   metrics   │ │ daily_logs  │ │  responses  │            │
│  │  (schema)   │ │  (per day)  │ │  (values)   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

- **Metrics** define WHAT data to collect (stable schema)
- **Pages** define HOW to collect it (can change per UX version)
- New UX version = new rows with `ux_version = 'v2'`, old data intact

### Flexibility Requirements

| Need | Solution |
|------|----------|
| Add new questions | Insert new `metrics` + `pages` rows |
| Change page order | Update `display_order` in `pages` |
| User custom questions | Future: `user_custom_metrics` table |
| Audio customization | Future: ElevenLabs integration + track library |

## X. Future Roadmap

### Phase A: Logging (Current)
- ✅ Database schema for all sequences
- ⬜ Frontend: Onboarding/Morning/Evening sequences
- ⬜ Progress tracking and seamless resume

### Phase B: Insights Tab
- Behavioral correlates visualization
- Execution Flow Day frequency trends
- Personalized recommendations

### Phase C: Customization
- User-defined custom metrics in sequences
- Reality-Defining Audio editor (ElevenLabs TTS)
- Custom underlay tracks from library
- Spotify integration (future)

### Phase D: Community
- Community calls (initially Google Meet links)
- Accountability partner matching
- In-app meetings (future)
- AI-guided counseling with voice input

## XI. Admin Dashboard KPIs

Track per UX version + date period:

| Metric | Query |
|--------|-------|
| Page abandonment | `page_events` WHERE `event_type = 'page_abandon'` GROUP BY `page_key` |
| Help/error/stuck clicks | `page_events` WHERE `event_type IN ('help_click', 'error_click', 'stuck_click')` |
| Feature link popularity | `page_events` WHERE `event_type = 'link_click'` GROUP BY `metadata->>'link_key'` |
| Avg starting EFDs | `metric_responses` WHERE `metric_key = 'last_efd_date'` |
| Weekly EFD progression | Aggregate evening ratings by week |
| Text suggestions | `feature_suggestions` table |

**Export**: PDF report per UXvN version + date range

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase
- **Deployment**: PM2 on Ubuntu server via SSH

## Project Structure

**To regenerate this tree:** `tree -I 'node_modules|.next|.git' --dirsfirst -L 4`

```
.
├── app
│   ├── public                          # Static assets (SVGs, icons)
│   ├── src
│   │   ├── app
│   │   │   ├── (app)                   # Grouped routes for sequences
│   │   │   ├── api                     # API routes
│   │   │   ├── auth
│   │   │   │   └── actions.ts          # Server actions: signup, login, signout
│   │   │   ├── dashboard               # Protected dashboard
│   │   │   ├── login                   # Login page
│   │   │   ├── onboarding              # Onboarding flow (pages 1-5)
│   │   │   │   ├── 1/page.tsx          # "How can we call you?"
│   │   │   │   ├── 2/page.tsx          # Timezone confirmation
│   │   │   │   ├── 3/page.tsx          # EFD yes/no question
│   │   │   │   ├── 4/page.tsx          # Date picker (placeholder)
│   │   │   │   ├── 5/page.tsx          # EFD explanation (placeholder)
│   │   │   │   ├── actions.ts          # Server actions for onboarding
│   │   │   │   └── layout.tsx          # Shared layout with help popup
│   │   │   ├── signup                  # Signup page with invite code
│   │   │   ├── globals.css             # Design system + Tailwind
│   │   │   └── layout.tsx              # Root layout
│   │   ├── components                  # Reusable UI components
│   │   ├── lib                         # Utility libraries
│   │   ├── types
│   │   │   └── database.ts             # Generated Supabase types
│   │   ├── utils/supabase              # Supabase client utilities
│   │   └── middleware.ts               # Auth middleware
│   └── supabase/migrations             # Database migrations (13 files)
└── README.md
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

### 2025-12-15: Time & Sequence Logic Documentation

**Added comprehensive documentation for all time-based and sequence-based conditions.**

| Section | Content |
|---------|---------|
| VI. Time & Sequence Logic | State determination flowchart, time rules, night owl logic, progress tracking |
| VII. Testing Guide | SQL reset queries, verification queries, testing checklist template |

**Also added missing implementation details:**
- Evening rating scale labels (what shows under "10" for each rating)
- Audio player requirements (80% unlock, lock screen support, user-specific audio)
- Time picker prefill (previous day's reflection time)
- Feature links placeholder behavior (coming soon + suggestion text field)
- 1-day backfill limit (max 1 day back, older days unrecoverable)
- Timezone prefill from browser's Intl API
- v1-e-14 final page logic (shows "tomorrow" only if returning next day)

This enables developers to understand the complete routing logic and test freely during development.

---

### 2025-12-14: Auth System with Invite Code Validation

**Implemented complete signup/login flow with invite code gating.**

#### Files Created:

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Tailwind imports (was missing, caused build error) |
| `src/app/auth/actions.ts` | Server actions: signup (with invite validation), login, signout |
| `src/app/signup/page.tsx` | Signup form with email, password, invite code fields |
| `src/app/login/page.tsx` | Login form with email, password fields |

#### Database Migrations:

| Migration | Fix |
|-----------|----- |
| `20251213235210_add_user_profile_insert_policy.sql` | Added missing INSERT RLS policies |
| `20251213235719_fix_trigger_rls_bypass.sql` | Fixed `SET search_path` for RLS bypass |

#### Auth Flow:

```
Signup form → validate_invite_code(code) → Invalid? Show error
                                        → Valid? Create user → use_invite_code() → /onboarding/1
```

---

### 2025-12-14: Onboarding UI (Pages 1-3)

**First 3 onboarding pages with elite minimalist black/white design.**

#### Design System:

- Pure black background (`#000000`)
- White text, gray secondary text
- White outline buttons (fill on hover)
- CSS custom properties in `globals.css`

#### Files Created:

| File | Purpose |
|------|---------|
| `onboarding/layout.tsx` | Shared layout with help/error/stuck popup |
| `onboarding/actions.ts` | Server actions: saveDisplayName, saveTimezone, saveMetricResponse |
| `onboarding/1/page.tsx` | "How can we call you?" → saves `name` |
| `onboarding/2/page.tsx` | Timezone auto-detect + confirm → saves `timezone` |
| `onboarding/3/page.tsx` | EFD yes/no → saves to `metric_responses`, branches correctly |
| `onboarding/4/page.tsx` | Date picker (placeholder) |
| `onboarding/5/page.tsx` | EFD explanation (placeholder) |

#### Files Modified:

| File | Change |
|------|--------|
| `globals.css` | Added CSS design system (variables, button classes) |
| `signup/page.tsx` | Refactored to minimalist black/white design |
| `login/page.tsx` | Refactored to match signup design |
| `auth/actions.ts` | Changed signup redirect: `/dashboard` → `/onboarding/1` |

#### Onboarding Flow:

```
Signup → /onboarding/1 → /onboarding/2 → /onboarding/3 → /onboarding/4 or /5
         (name)          (timezone)       (EFD yes/no)    (branches based on answer)
```

#### Verification Query:

Run this in Supabase SQL Editor to verify data saves correctly:

```sql
SELECT up.name, up.timezone, mr.value_text as efd_response, m.key as metric_key
FROM user_profiles up
LEFT JOIN metric_responses mr ON mr.user_id = up.user_id
LEFT JOIN metrics m ON m.id = mr.metric_id
WHERE up.name IS NOT NULL
ORDER BY up.created_at DESC LIMIT 5;
```

---

### 2025-12-13: Supabase Database Architecture

**Complete backend database schema implemented via Supabase CLI migrations.**

#### Tables Created (10 total):

| Table | Purpose |
|-------|---------|
| `invite_codes` | Universal code (M246MVP) + per-user referral codes (4 each) |
| `user_profiles` | Extended user data: name, timezone, onboarding status |
| `sequences` | Sequence definitions: onboarding, morning, evening |
| `pages` | Individual pages within sequences with content/branching |
| `metrics` | Data point definitions (what we collect from users) |
| `daily_logs` | One row per user per day, links all daily data |
| `sequence_progress` | Tracks where user is in each sequence |
| `metric_responses` | Actual user responses (ratings, text, dates) |
| `page_events` | Analytics: page views, help/error/stuck clicks |
| `feature_suggestions` | User suggestions from feature links |

#### Key Triggers & Functions:

- **`on_auth_user_created`**: Auto-creates `user_profile` + 4 referral codes on signup
- **`get_or_create_daily_log(user_id, date)`**: Idempotent daily log creation
- **`get_or_create_sequence_progress(user_id, sequence_key, daily_log_id)`**: Progress tracking
- **`save_metric_response(...)`**: Upsert metric values (prevents duplicates)
- **`log_page_event(...)`**: Log analytics events
- **`validate_invite_code(code)`**: Check if code is valid for signup
- **`use_invite_code(code, user_id)`**: Mark one-time code as used

#### Invite Code System:

- **Universal code `M246MVP`**: Toggleable via `active` field, unlimited use
- **Referral codes**: 8-char unique codes, 4 per user, single-use
- One-time codes auto-invalidate after use (`used = true`)

#### Row Level Security (RLS):

All user data tables have RLS enabled. Users can only access their own data.
Public tables: `sequences`, `pages`, `metrics`, `invite_codes` (read-only).

#### Migration Files:

Located in `app/supabase/migrations/`:
```
00001_create_invite_codes.sql
00002_create_user_profiles.sql
00003_create_sequences_and_pages.sql
00004_create_metrics.sql
00005_create_daily_logs.sql
00006_create_sequence_progress.sql
00007_create_metric_responses.sql
00008_create_page_events.sql
00009_create_feature_suggestions.sql
00010_create_rls_policies.sql
00011_storage_bucket_docs.sql (documentation only)
```

#### ✅ Storage Bucket (Complete)

`audio` bucket created with RLS policies:
- INSERT, SELECT, UPDATE, DELETE for authenticated users
- Files stored at `audio/{user_id}/filename.mp3`
- Default audio at `audio/default/default_grounding_audio.mp3`

#### Supabase CLI Commands:

```bash
cd app

# Check migration status
npx supabase migration list

# Create new migration
npx supabase migration new <name>

# Push migrations to remote
npx supabase db push

# Pull remote schema changes
npx supabase db pull

# Generate TypeScript types
npx supabase gen types typescript --linked > src/types/database.ts
```

---

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

---

## Database Architecture

### Entity Relationship Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   auth.users    │────▶│  user_profiles  │◀────│  invite_codes   │
│   (Supabase)    │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   daily_logs    │────▶│sequence_progress│◀────│    sequences    │
│  (per user/day) │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ 1:N                   │                       │ 1:N
         ▼                       │                       ▼
┌─────────────────┐              │              ┌─────────────────┐
│metric_responses │              │              │      pages      │
│                 │              ▼              │                 │
└─────────────────┘     ┌─────────────────┐     └─────────────────┘
                        │   page_events   │
                        │  (analytics)    │
                        └─────────────────┘
```

### Data vs. Pages Separation (Critical Concept)

The schema separates **what data we collect** from **how we collect it**:

- **`metrics` table**: Defines data points (e.g., `rating_positivity`, `magic_task`)
- **`pages` table**: Defines UI pages that collect this data
- **`metric_responses`**: Stores actual values, linked by `metric_id`

This allows changing UX (page order, content, flow) **without breaking data collection**.
New UX versions add new rows with `ux_version = 'v2'` etc.

### Sequence Progress Tracking

Users can leave and return seamlessly:

1. `sequence_progress.current_page_id` = where they are
2. `sequence_progress.path_choices` = branching decisions made (JSON)
3. `sequence_progress.status` = `not_started` | `in_progress` | `completed`

For **onboarding**: `daily_log_id = NULL` (not day-specific)
For **morning/evening**: `daily_log_id` links to that day's log

### Timezone Handling

- Stored in `user_profiles.timezone`
- Frontend calculates user's local date/time
- Calls `get_or_create_daily_log(user_id, local_date)`
- **Night owl logic**: If time < 3am, use yesterday's date for evening sequence

---

## Developer Onboarding

### First-Time Setup

```bash
# 1. Clone repo
git clone https://github.com/coffeeandcoffee/m246_mvp_v2.git
cd m246_mvp_v2/app

# 2. Install dependencies
npm install

# 3. Get environment variables from team lead
cp .env.example .env.local
# Edit .env.local with actual values

# 4. Link Supabase (requires login)
npx supabase login
npx supabase link --project-ref fkwuvonuicokyxvdqxgq

# 5. Run locally
npm run dev
```

### Important Gotchas

1. **RLS is enabled**: All queries require authenticated user context
2. **Triggers run on signup**: Don't manually insert into `user_profiles`
3. **Migration order matters**: Files are applied numerically
4. **`db lint` fails locally**: Expected - we use remote DB only, not local Docker
5. **Storage bucket**: Must be created manually in Supabase Dashboard

### Generating TypeScript Types

After schema changes, regenerate types:

```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

---

## Next Steps (Frontend Integration)

Priority order for implementation:

1. ~~**Auth flow with invite codes**~~: ✅ Done
2. ~~**Onboarding sequence**~~: ✅ Done — Pages v1-o-1 through v1-o-12 complete with branching (data logging tested, but leaving and entering again not tested.)
3. **Morning sequence**: Pages v1-m-1 through v1-m-22
4. **Evening sequence**: Pages v1-e-1 through v1-e-14
5. **Progress persistence**: Save/restore position on page load
6. **Audio player**: Integrate with Storage bucket
7. **Admin dashboard**: Analytics queries on `page_events`

See `app/supabase/migrations/00004_create_metrics.sql` for full list of data points to collect.

