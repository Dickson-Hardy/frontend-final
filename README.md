# AMHSJ - Advances in Medicine & Health Sciences Journal

A comprehensive journal management system built with Next.js frontend and NestJS backend.

## Features

### Frontend (Next.js)
- Modern, responsive design with Tailwind CSS
- News and announcements system
- Volume and article display
- Admin dashboard for content management
- Real-time data with React Query
- Authentication and role-based access

### Backend (NestJS)
- RESTful API with MongoDB
- User authentication with JWT
- Email services (Resend + SMTP)
- File storage with Cloudinary
- Role-based authorization
- API documentation with Swagger

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account
- Email service accounts (Resend, SMTP)

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd amhsj-journal
\`\`\`

2. Install frontend dependencies
\`\`\`bash
npm install
\`\`\`

3. Install backend dependencies
\`\`\`bash
cd backend
npm install
cd ..
\`\`\`

4. Environment Setup
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

5. Start MongoDB
\`\`\`bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
\`\`\`

6. Start the backend
\`\`\`bash
cd backend
npm run start:dev
\`\`\`

7. Start the frontend
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `RESEND_API_KEY` - Resend email service key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Optional Variables
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password

## API Documentation

Once the backend is running, visit `http://localhost:3001/api` for Swagger documentation.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
├── components/             # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── articles/       # Article management
│   │   ├── auth/           # Authentication
│   │   ├── email/          # Email services
│   │   ├── news/           # News management
│   │   ├── upload/         # File upload
│   │   ├── users/          # User management
│   │   └── volumes/        # Volume management
└── public/                 # Static assets
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
