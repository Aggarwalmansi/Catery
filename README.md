# Catery - OccasionOS

**Catery** is a full-stack platform that connects customers with professional caterers for their events. It simplifies the discovery, booking, and management process, providing tailored experiences for Users, Caterers, and Administrators.

##  Key Features

### User (Customer)
- **Caterer Discovery**: Browse a variety of verified caterers by occasion or category.
- **Seamless Booking**: Book caterers for specific dates and occasions directly through the platform.
- **Order Management**: View booking history and track current order status.

### Caterer (Vendor)
- **Vendor Onboarding**: Apply to become a partner, set up a profile, and get verified.
- **Menu Management**: Create, update, and delete menu items with detailed descriptions and pricing.
- **Package Creation**: Bundle menu items into custom packages for easier customer selection.
- **Dashboard & Stats**: View incoming orders, revenue statistics, and manage business status (Active/Paused).

### Admin
- **Vendor Verification**: Review and approve/reject new caterer applications.
- **Platform Analytics**: Monitor total users, active vendors, booking volume, and total revenue.
- **Vendor Management**: Disable or remove vendors if necessary to maintain platform quality.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context (Auth)
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Bcryptjs

### DevOps & Hosting
- **Frontend**: Vercel
- **Backend**: Render / Heroku
- **Database**: MongoDB Atlas

---

## System Flow
1.  **Users** sign up and browse caterers.
2.  **Caterers** sign up, complete onboarding, and wait for **Admin** verification.
3.  Once verified, **Caterers** create menus and packages.
4.  **Users** book a package/caterer for an occasion.
5.  **Caterers** accept/reject orders via their dashboard.

---

## Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/Aggarwalmansi/Catery.git
cd Catery
```

### 2. Backend Setup
```bash
cd backend
npm install
```
*Create a `.env` file in `/backend` with:*
```env
PORT=5001
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/catery"
JWT_SECRET="your_jwt_secret_key"
FRONTEND_URL="http://localhost:3000"
```
*Run Database Migration:*
```bash
npx prisma generate
```
*Start Backend:*
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
*Create a `.env` file in `/frontend` with:*
```env
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
```
*Start Frontend:*
```bash
npm run dev
```
Visit `http://localhost:3000` to view the app.

---

## Deployment

### Frontend (Vercel)
1.  Import the repository to Vercel.
2.  Set Environment Variable:
    -   `NEXT_PUBLIC_API_URL`: Your live backend URL (e.g., `https://catery-api.onrender.com/api`)

### Backend (Render/Heroku)
1.  Connect repository to your hosting provider.
2.  Set Environment Variables:
    -   `DATABASE_URL`: MongoDB Connection String
    -   `JWT_SECRET`: Secret key
    -   `FRONTEND_URL`: Your live frontend URL (e.g., `https://catery.vercel.app`)
3.  **Build Command**: `npm install && npx prisma generate`
4.  **Start Command**: `node server.js`


**Author**: Mansi Agarwal
