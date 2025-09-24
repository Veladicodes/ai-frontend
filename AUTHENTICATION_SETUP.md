# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database Configuration (for Prisma)
DATABASE_URL="file:./dev.db"
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - Your production domain + `/api/auth/callback/google` (for production)
6. Copy the Client ID and Client Secret to your `.env.local` file

## Database Setup (Optional - for email/password auth)

If you want to use email/password authentication, you'll need to set up the database:

```bash
# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Push the schema to your database (for SQLite)
npx prisma db push
```

## Running the Application

1. Install dependencies: `npm install`
2. Set up environment variables as described above
3. Run the development server: `npm run dev`
4. Visit `http://localhost:3000` to see the home page
5. Click "Sign Up" or "Login" to access the authentication page

## Authentication Flow

1. **Home Page**: Contains "Sign Up" and "Login" buttons that redirect to `/auth`
2. **Auth Page**: Provides two options:
   - Google OAuth (requires Google OAuth setup)
   - Email/Password form (requires database setup)
3. **Dashboard**: Protected route that shows user information and requires authentication
4. **Middleware**: Automatically redirects unauthenticated users from protected routes to `/auth`

## Features Implemented

- ✅ Google OAuth 2.0 authentication
- ✅ Email/password authentication with registration
- ✅ Secure session management with NextAuth.js
- ✅ Protected routes with middleware
- ✅ User profile display in dashboard
- ✅ Logout functionality
- ✅ Error handling and user feedback
- ✅ Responsive UI with brand styling
- ✅ Loading states and form validation

## Testing the Authentication

1. **Google OAuth**: Click "Continue with Google" (requires Google OAuth setup)
2. **Email Registration**: Fill out the form and click "Create Account"
3. **Email Login**: Use existing credentials to sign in
4. **Protected Route**: Try accessing `/dashboard` without authentication (should redirect to `/auth`)
5. **Logout**: Click the logout button in the dashboard header
