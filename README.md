# Clear Lakes Dental - OA

A full-stack application built with Nuxt 3, TypeScript, and Supabase featuring authentication and role-based access control.

## Features

- **Authentication**: Secure login system using Supabase Auth
- **Role-based Access Control**: 
  - Basic users can only view their own entries
  - Admin users can view all entries and manage users
- **Data Management**: Add and view entries with persistent storage
- **User Management** (Admin only): Add new users and ban/unban existing users

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Nuxt Server Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd nuxt_template
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Set up Supabase tables by running this SQL:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'basic' CHECK (role IN ('basic', 'admin')),
  banned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. Run the development server
```bash
npm run dev
```

## Pages

- `/login` - User authentication
- `/` - Display entries (filtered by role)
- `/addData` - Add new entries
- `/users` - User management (admin only)

## API Routes

All Supabase operations are performed through server-side API routes for security:

- `POST /api/getProfile` - Get user profile
- `POST /api/getEntries` - Get entries (role-filtered)
- `POST /api/postData` - Add new entry
- `POST /api/getUsers` - Get all users (admin)
- `POST /api/addUser` - Create new user (admin)
- `POST /api/banUser` - Ban/unban user (admin)