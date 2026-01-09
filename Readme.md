### CourseX - Learning Management Platform (Non commercial)

A full-stack learning management system that enables instructors to create and sell courses, and allows students to purchase and track their learning progress.

## Course Video assets are stored in Cloudinary

#### Features
- **Core Functionality**
Dual-Role Authentication: Switch between students and instructors (like Udemy)
Course Management: Create courses subdivided into sections and lessons
Product Bundling: Combine multiple courses into sellable products with custom pricing
E-Commerce: Complete purchase flow with payment processing and refund management
Progress Tracking: Monitor student progress across courses and lessons
Responsive UI: Seamless experience across desktop and tablet

- **Instructor Features**
Create and manage courses with hierarchical structure
Organize content into sections and lessons
Bundle courses into products
Track student enrollment and progress
Manage sales and process refunds

- **Student Features**
Browse and purchase courses/products
Track learning progress
Access course content organized by sections and lessons
View purchase history

#### Tech Stack
**Backend**

Hono.js - Lightweight web framework for API routes
Drizzle ORM - Type-safe database queries
NeonDB - PostgreSQL database (serverless)

**Frontend**

React - UI library with functional components and hooks
TypeScript - Static type checking
shadcn/ui - Accessible component library
Tailwind CSS - Utility-first styling

### Setup for local development
This project uses PNPM as package manager.
**Backend Setup**
```
cd server
pnpm install
```

**Frontend Setup**
```
cd frontend
pnpm install
```

After that, come to project and run `pnpm dev` to start both frontend and server.

### Environment files

**Backend (.env)**
DATABASE_URL=***  
CLERK_WEBHOOK_SIGNING_SECRET=***   
CLERK_PUBLISHABLE_KEY=***   
CLERK_SECRET_KEY=***   
CLOUDINARY_CLOUD_NAME=***   
CLOUDINARY_API_KEY=***   
CLOUDINARY_API_SECRET=***   

**Frontend (.env)**
VITE_CLERK_PUBLISHABLE_KEY=***   
VITE_BACKEND_URL=***   
