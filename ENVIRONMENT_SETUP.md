# Frontend Environment Configuration

## Required Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_NAME=AMHSJ
NEXT_PUBLIC_APP_DESCRIPTION=Advances in Medicine & Health Sciences Journal
```

## How to Create the File

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Create the .env.local file**:
   ```bash
   # On Windows (PowerShell)
   New-Item -Path ".env.local" -ItemType File
   
   # On Windows (Command Prompt)
   echo. > .env.local
   
   # On Mac/Linux
   touch .env.local
   ```

3. **Add the content** to the `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_NAME=AMHSJ
   NEXT_PUBLIC_APP_DESCRIPTION=Advances in Medicine & Health Sciences Journal
   ```

## Optional Environment Variables

You can also add these optional variables for enhanced functionality:

```env
# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id

# Error Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false

# Development Settings (Optional)
NEXT_PUBLIC_DEV_MODE=true
```

## Important Notes

- **NEXT_PUBLIC_** prefix is required for client-side environment variables
- The `.env.local` file is automatically ignored by git (it's in .gitignore)
- Restart your Next.js development server after creating/updating the file
- Make sure your backend is running on port 3001 (or update the URL accordingly)

## Verification

After creating the file, restart your frontend development server:

```bash
cd frontend
pnpm run dev
```

The frontend should now properly connect to your backend API at `http://localhost:3001`.



