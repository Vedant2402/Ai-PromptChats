# AI Prompt Chat

Lightweight, modern chat interface to send prompts to the OpenAI API with local chat history, error handling, and a clean responsive UI.

## Features
- Prompt input + submit button
- Fetches responses from OpenAI via a secure Express backend
- Dynamic chat display with auto-scroll
- Loading + error states
- Local (browser) chat history persistence
- Clear history button
- Abort (Stop) in-flight request

## Security Note
The OpenAI API key is stored only in the server environment via `.env` and never shipped to the browser. Do **not** expose your real key in client code or commit `.env`.

## Getting Started

1. Install dependencies:
```bash
npm install
```
2. Copy `.env.example` to `.env` and set your key:
```bash
cp .env.example .env
```
Edit `.env`:
```
OPENAI_API_KEY=sk-your-real-key
```
3. Run dev (starts server + Vite):
```bash
npm run dev
```
Open http://localhost:5173

## Scripts
- `npm run dev` – start backend + frontend concurrently
- `npm run build` – production build
- `npm run preview` – preview built client

## Folder Structure
```
server/          Express backend (proxy to OpenAI)
src/             React UI
src/components/  Reusable chat components
index.html       Vite entry HTML
.env.example     Template for environment variables
```

## Tech Stack
- React 18 + Vite
- Express + openai SDK
- Modern CSS (no framework) with gradient styling

## Customization
Change the model in `server/index.js` (default: `gpt-4o-mini`). Adjust temperature, max tokens, or add system prompts.

## Deployment
### Option A: Netlify (serverless)
Included `netlify.toml` and serverless functions. Steps:
1. Push repository to GitHub.
2. In Netlify create a new site from repo.
3. Set environment variable `OPENAI_API_KEY` in Site settings > Build & deploy > Environment.
4. Build command: `npm run build`, Publish directory: `dist`.
5. Deploy. Client calls `/api/chat` which is redirected to `/.netlify/functions/chat`.
6. Test: visit `/api/diag` on your deployed domain; it should return `{ "hasKey": true }`.

### Option B: Separate Express Server
Deploy `server/index.js` on Render/Railway/Fly and point frontend fetch to that domain.

### SPA Redirect
`netlify.toml` includes a catch‑all redirect so deep links resolve to `index.html`.

## License
MIT
