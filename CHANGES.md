# Changes: demo reliability (branch `fix/demo-reliability`)

- On page load, poll `GET /health` immediately (6 s timeout per attempt, backoff
  up to 4 s, gives up after 3 min). While waiting, a "Warming up the server…"
  banner with an elapsed-seconds counter is shown and the chat input is disabled,
  so a Render cold start never looks like a hang.
- Once healthy, the document list is re-fetched (the first fetch usually fails
  while the server is asleep).
- If the server never answers, the banner turns into a clear "not responding"
  message with a contact email.
- Header badge updated from "Gemini 1.5 Flash" to "Llama 3.3 · Groq" to match
  the backend.

Env vars: unchanged. `VITE_API_URL` must point at the backend
(e.g. `https://docmind-rag-backend.onrender.com`).
