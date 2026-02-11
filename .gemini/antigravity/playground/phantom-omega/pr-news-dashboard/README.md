# PR News Dashboard (Real-time from Google Sheets)

A dashboard application that fetches data directly from a public Google Sheet CSV export to display a news feed, summary statistics, and daily submission reports.

---

## 🚀 How it Works (Real-time Architecture)

This application is **"Client-Side Real-time"**. 

1.  **Direct Fetch**: When a user opens the dashboard, the browser makes a direct request to the Google Sheet CSV URL.
2.  **No Server**: There is no backend server to maintain. The "database" is your Google Sheet.
3.  **Instant Updates**:
    *   **Editor**: You add a new row in Google Sheets.
    *   **Viewer**: The next person to refresh the dashboard sees the new data immediately.
    *   *Note: Google Sheets sometimes caches CSV exports for ~5 minutes, but usually it's instant.*

## 📦 Tech Stack

-   **Frontend**: React + Vite + TypeScript
-   **Styling**: Vanilla CSS (Premium Glassmorphism Design)
-   **Data**: PapaParse (CSV Parsing)
-   **Charts**: Recharts
-   **Icons**: Lucide React

## 🛠️ Setup & Development

1.  **Install Dependencies**
    ```bash
    npm install
    ```
2.  **Start Development Server**
    ```bash
    npm run dev
    ```

## 🌐 Deployment (GitHub Pages)

This project is set up to deploy easily to GitHub Pages.

### Step 1: Prepare `vite.config.ts`
Open `vite.config.ts` and set the `base` property to your repository name:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/<YOUR_REPO_NAME>/', // e.g. '/pr-news-dashboard/'
})
```

### Step 2: Push to GitHub
1.  Create a new repository on GitHub.
2.  Push this code to the repository.

### Step 3: Deploy
Run the deployment script:
```bash
npm run deploy
```
*This command builds the project and pushes the `dist` folder to a `gh-pages` branch.*

### Step 4: Activate GitHub Pages
1.  Go to your GitHub Repository > **Settings** > **Pages**.
2.  Under "Build and deployment" > "Source", select **Deploy from a branch**.
3.  Select the **`gh-pages`** branch and save.
4.  Your site will be live at: `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`

## 📊 Features

-   **Daily Report**: Automatically calculates which districts have submitted news "Today" and lists those missing.
-   **Search & Filter**: Real-time filtering by district or keyword.
-   **Responsive Design**: Works perfectly on mobile and desktop.
