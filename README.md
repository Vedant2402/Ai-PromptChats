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
For production deploy the Express server (e.g. Render, Fly.io, Railway) and serve the built client (`npm run build`).

1. Set `OPENAI_API_KEY` in your hosting provider's environment settings.
2. Serve `dist/` behind the same domain or adjust the client fetch URL (`/api/chat`).

## License
MIT
