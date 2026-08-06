# Fitopia — Project Context

## What we're building
Fitopia is a fitness app built specifically for the Ethiopian and Eritrean diaspora. It combines AI-generated personalised workout plans, meal planning, community features, and progress tracking. The cultural identity of the target market is central to the product — motivational quotes from African athletes and philosophers, Orthodox fasting workout modes, and a community built around shared heritage.

## Repositories
- Frontend: ~/fitopia (React Native, Expo Router)
- Backend: ~/fitopia-backend (FastAPI, PostgreSQL)
- Backend is deployed on Railway at: web-production-9079c.up.railway.app

## Tech Stack

### Frontend
- React Native with Expo Router (file-based routing)
- React Native Reanimated for animations
- AsyncStorage for local caching
- Expo Go for testing (no EAS build yet)
- All API calls live in services/api.js
- Colors defined in constants/colors.js — never hardcode colors
- Shared components in components/
- Icons: @expo/vector-icons (Feather, Ionicons, MaterialCommunityIcons)

### Backend
- FastAPI + SQLAlchemy ORM
- PostgreSQL on Railway
- JWT authentication — tokens passed as ?token= query param on every request
- Models in app/models/
- Routers in app/routers/
- Registered in app/main.py

## Key Conventions

### Backend patterns
- Every protected endpoint starts with: user = get_user_from_token(token, db)
- Admin-only endpoints start with: require_admin(token, db) — lives in app/routers/admin.py
- New models must be imported in app/main.py so SQLAlchemy creates the table
- Database migrations are manual — we don't use Alembic. New columns are added via Railway console: ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...
- Pydantic schemas live in app/schemas/ or inline in the router file for simple ones

### Frontend patterns
- New screens go in app/ following Expo Router file-based routing
- Dynamic routes use [param].js naming e.g. app/profile/[id].js
- All API functions go in services/api.js and are exported individually
- Token is retrieved via getToken() helper already in api.js
- useFocusEffect + useCallback is used for data fetching on screen focus
- FadeUpItem from components/ScreenWrapper is used for entrance animations
- Completion screens use components/WorkoutCompletionScreen.js (shared)

## Database Models (current)
- User — name, email, username, bio, gender, is_pro, is_admin, fitness_level, goal, days_per_week, training_days, workout_duration, equipment, referral_code, created_at
- Exercise — name, muscle_group, equipment, difficulty, sets_range, reps_range, is_timed, seconds_range, instructions, priority, movement_pattern
- WorkoutLog — user_id, date, workout_name
- WorkoutPlan — user_id, plan (JSONB), created_at
- Meal / MealPlan — nutrition and weekly meal data
- CommunityPost — user_id, text, tag, challenge_id, like_count, comment_count
- CommunityComment — post_id, user_id, text
- PostLike — post_id, user_id
- PostReport — post_id, reported_by, reason
- Follow — follower_id, following_id
- Challenge — name, description, color, display_order, created_by
- Quote — text, author (150+ curated real quotes, used on workout completion screen)

## App Structure

### Tabs (app/(tabs)/)
- index.js — Home screen (streak, today's workout, nutrition, community preview)
- workouts.js — Workout library (For You, Home, Gym, Fasting, Library filters)
- community.js — Community feed with challenges row and posts
- profile.js — Own profile with bio, stats, heatmap, settings

### Key screens
- app/workout/[id].js — Workout detail/intro screen before starting
- app/workout/active.js — Live workout screen with exercise progression
- app/workout/cardio.js — Cardio circuit screen
- app/workout/library.js — Exercise category browsing
- app/workout/liked.js — Saved exercises
- app/workout/circuits.js — Intense cardio circuits
- app/exercise/[id].js — Exercise detail with instructions
- app/profile/[id].js — Other users' profiles
- app/community/[id].js — Challenge detail page with posts
- app/challenge/[id].js — Challenge detail screen
- app/challenges.js — All challenges list
- app/search.js — Search users
- app/compose.js — Create community post (supports challenge tagging)
- app/comments.js — Post comments
- app/consistency.js — Consistency detail screen with heatmap
- app/admin.js — Admin dashboard (is_admin users only)
- app/admin-challenges.js — Challenge management (reorder, delete)
- app/onboarding/ — 8-step onboarding flow (step1.js through step8.js + complete.js)

## Admin System
- is_admin boolean on User model
- Admins are set manually via Railway console
- Admin dashboard redirects at login if user.is_admin is true
- Admin can: view stats, toggle user Pro status, create/reorder/delete challenges
- Future admin features will follow same require_admin() gate pattern

## Features Complete
- Personalised workout plan generation (workout_generator.py)
- AI meal plan generation (OpenAI gpt-4o-mini)
- Community posts, likes, comments, follow system
- User profiles with bio, followers/following, post history
- User search
- Challenges — create, list, detail page, post tagging
- GitHub-style yearly workout heatmap
- Consistency screen with completion percentage
- Workout completion screen with real motivational quotes (from Quote table)
- Exercise library with category filtering
- Liked/saved exercises
- Cardio circuits
- Admin dashboard

## Features Pending
- Stripe payments + Free vs Pro feature split
- EAS Build (TestFlight / Play Store)
- Image posting in community
- Amharic language support
- Video integration for exercises
- AI coaching tab
- Dark mode
- Push notifications
- Custom domain (api.fitopia.app)
- Referral reward system (3 friends = 1 month Pro)

## Working Style Notes
- Explain what you're building and why before writing code
- Add meaningful inline comments to all code
- Never hardcode colors — use constants/colors.js
- Always give full git add/commit/push commands when a feature is ready
- Database migrations go via Railway console, never assume create_all handles new columns
- Test admin features by logging in as robel12f34@gmail.com (is_admin: true)
