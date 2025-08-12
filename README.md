# AI Prompt Chat

Lightweight, modern chat interface to send prompts to the OpenAI API with local chat history, error handling, and a clean responsive UI.

## Screenshots -
<img width="1919" height="868" alt="Screenshot 2025-08-11 210654" src="https://github.com/user-attachments/assets/2d07d1c2-3391-4675-9f17-678d85fd8b87" />
UI

<img width="1919" height="873" alt="Screenshot 2025-08-11 210559" src="https://github.com/user-attachments/assets/16a91f35-3ee4-417f-b815-b22dfc1ab642" />
Error Handling & Clear Button

<img width="1919" height="495" alt="Screenshot 2025-08-11 210615" src="https://github.com/user-attachments/assets/56e12552-4320-4f82-bb6b-e040b96416dd" />
Confirmation

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
