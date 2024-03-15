# Spread The Message

## Setting Up Locally

This guide will help you set up both the frontend and backend of the Spread The Message application on your local machine.

### Prerequisites

- Node.js installed
- Git installed
- Access to a Redis database (for backend setup)

### Clone the Repository

First, clone the repository to your local machine:

git clone <repository-url>
cd spread-the-message

Replace `<repository-url>` with the actual URL of the repository.

### Frontend Setup

1. Navigate to the frontend directory:

cd frontend

2. Install dependencies:

npm install

3. Create a `.env.local` file in the root of the frontend directory and add the following variable:

VITE_BACKEND_URL=http://localhost:4000

This variable points to your local backend server.

4. Start the development server:

npm run dev

The frontend should now be running on `http://localhost:3000`.

### Backend Setup

1. Navigate to the backend directory:

cd ../backend

2. Install dependencies:

npm install

3. Create a `.env.local` file in the root of the backend directory with the following environment variables:

REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token

Replace `your_redis_url` and `your_redis_token` with your actual Redis database URL and token.

4. Start the development server:

npm run dev

The backend should now be running on `http://localhost:4000`.

### Accessing the Application

With both servers running, you can access the frontend of the application by navigating to `http://localhost:3000` in your web browser.
