# Deploying Frontend to Netlify

This guide explains how to deploy your Math Forum frontend using Netlify and Parcel.

## Setup Completed
I have already created the necessary configuration files for you:
1.  **`package.json`**: Lists `parcel` as a dependency.
2.  **`netlify.toml`**: Tells Netlify to use `npm run build` and publish the `dist` folder.

## Steps to Deploy

### 1. Push to GitHub
Ensure all your files (including `package.json` and `netlify.toml`) are pushed to your GitHub repository.

### 2. Connect to Netlify
1.  Log in to [Netlify](https://www.netlify.com/).
2.  Click **"Add new site"** -> **"Import from an existing project"**.
3.  Select **"Deploy with GitHub"**.
4.  Choose your repository (`math-roadmap`).

### 3. Verify Settings
Netlify should automatically detect the settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

If these are not filled in automatically, enter them manually.

### 4. Deploy
Click **"Deploy site"**.
Netlify will:
1.  Install Parcel.
2.  Build your HTML/CSS/JS.
3.  Publish the website.

You will get a URL like `https://yoursite.netlify.app`.
