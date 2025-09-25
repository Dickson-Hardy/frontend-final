# PowerShell script to create frontend environment file
Write-Host "Creating frontend environment file..." -ForegroundColor Green

$envContent = @"
# Frontend Environment Variables
# This file is for local development only

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_NAME=AMHSJ
NEXT_PUBLIC_APP_DESCRIPTION=Advances in Medicine & Health Sciences Journal
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "Environment file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Contents of .env.local:" -ForegroundColor Yellow
Get-Content ".env.local"
Write-Host ""
Write-Host "Please restart your Next.js development server for changes to take effect." -ForegroundColor Cyan
Write-Host "Run: pnpm run dev" -ForegroundColor Cyan

