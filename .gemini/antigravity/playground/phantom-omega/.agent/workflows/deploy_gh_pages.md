---
description: How to deploy the PR News Dashboard to GitHub Pages
---

> [!NOTE]
> This workflow assumes you are in the root of the project (where `package.json` is located).

1. **Install `gh-pages` package:**
   ```bash
   npm install gh-pages --save-dev
   ```

2. **Update `vite.config.ts`:**
   Add the `base` property with your repository name.
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   // https://vite.dev/config/
   export default defineConfig({
     plugins: [react()],
     base: '/YOUR_REPO_NAME/', // <--- REPLACE THIS WITH YOUR ACTUAL REPO NAME (e.g., '/pr-news-dashboard/')
   })
   ```

3. **Update `package.json` scripts:**
   Add `predeploy` and `deploy` scripts.
   ```json
   "scripts": {
     // ... other scripts
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy to GitHub:**
   Run the deploy command.
   ```bash
   npm run deploy
   ```

5. **Verify Deployment:**
   Go to your GitHub repository settings -> Pages, and ensure the source is set to `gh-pages` branch. The site should be live at `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`.
