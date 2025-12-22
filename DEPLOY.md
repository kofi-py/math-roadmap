# Deploying to Render

This guide explains how to deploy your Math Forum backend to Render.com.

## Prerequisites
- Your code must be pushed to a **GitHub repository**.
- You need your **Neon Connection String** (from your `.env` file).

## Steps

### 1. Push to GitHub
Make sure your latest code (including the `backend` folder) is on GitHub.
*(Note check `.gitignore` to ensure `node_modules` and `.env` are NOT uploaded)*

### 2. Create New Web Service
1.  Log in to [Render.com](https://render.com).
2.  Click **"New +"** -> **"Web Service"**.
3.  Select **"Build and deploy from a Git repository"**.
4.  Connect your GitHub account and select your repository.

### 3. Configure the Service
- **Name**: `math-forum-backend` (or similar)
- **Region**: Choose one close to you (e.g., US East)
- **Branch**: `main` (or master)
- **Root Directory**: `backend` (Important! because your app is in a subfolder)
    - *If Render asks for "Base Directory", set it to `backend`.*
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Environment Variables
1.  Scroll down to the **"Environment Variables"** section.
2.  Click **"Add Environment Variable"**.
3.  **Key**: `DATABASE_URL`
4.  **Value**: Paste your Neon connection string (starts with `postgres://...`).
    - *Make sure to use the one from your `.env` file.*

### 5. Deploy
1.  Click **"Create Web Service"**.
2.  Render will clone your repo, install dependencies, and start the server.
3.  Wait for the logs to say "Server running on port...".

## Verification
Once deployed, Render will give you a URL (e.g., `https://math-forum-backend.onrender.com`).
You will need to update your frontend `forum.js` to point to this new URL instead of `localhost:3000` (specifically the `API_URL` constant).
