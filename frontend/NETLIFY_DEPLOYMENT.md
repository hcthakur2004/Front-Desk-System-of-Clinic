# Netlify Deployment Instructions

## Prerequisites

- A Netlify account
- Git repository with your frontend code

## Deployment Steps

1. **Login to Netlify**
   - Go to [Netlify](https://app.netlify.com/) and login to your account

2. **Add New Site**
   - Click on "Add new site" and select "Import an existing project"
   - Connect to your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - The netlify.toml file in the repository will automatically configure these settings

4. **Deploy the Site**
   - Click on "Deploy site"

5. **Set Up Custom Domain (Optional)**
   - Go to "Domain settings"
   - Click on "Add custom domain"
   - Follow the instructions to set up your domain

## Important Notes

- The frontend is configured to connect to the backend at: `https://front-desk-system-of-clinic-backend.onrender.com`
- Client-side routing is handled by the netlify.toml and _redirects files
- Any environment variables should be configured in the Netlify dashboard under "Site settings" > "Environment variables"

## Troubleshooting

- If you encounter 404 errors when refreshing pages, check that the redirects are properly configured
- For CORS issues, ensure your backend is properly configured to accept requests from your Netlify domain