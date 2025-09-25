@echo off
echo Creating frontend environment file...

echo # Frontend Environment Variables > .env.local
echo # This file is for local development only >> .env.local
echo. >> .env.local
echo # Backend API Configuration >> .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:3001 >> .env.local
echo. >> .env.local
echo # App Configuration >> .env.local
echo NEXT_PUBLIC_APP_NAME=AMHSJ >> .env.local
echo NEXT_PUBLIC_APP_DESCRIPTION=Advances in Medicine ^& Health Sciences Journal >> .env.local

echo.
echo Environment file created successfully!
echo.
echo Contents of .env.local:
type .env.local
echo.
echo Please restart your Next.js development server for changes to take effect.
pause
