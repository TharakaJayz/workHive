# workHive

Setup & deployment (Netlify frontend -> local backend via ngrok)

1. Install dependencies

	- Backend: cd backend && npm install
	- Frontend: cd frontend && npm install

2. Start the backend locally

	- From `backend`: `npm run dev` (or your usual start command). Backend listens on PORT (default 5000).

3. Expose backend with ngrok

	- Run: `ngrok http 5000`
	- Copy the HTTPS forwarding URL (e.g. `https://abc123.ngrok-free.app`)

4. Configure backend CORS

	- In `backend/.env` set `NGROK_URL` to the ngrok HTTPS URL (no path).

5. Configure Netlify env var

	- In Netlify Project Settings → Build & deploy → Environment → Environment variables, set:
		- `NEXT_PUBLIC_API_BASE_URL` = `<NGROK_HTTPS_URL>/api/v1` (example: `https://abc123.ngrok-free.app/api/v1`)

6. Redeploy frontend on Netlify

	- Trigger a redeploy (manual deploy or push to the connected branch). The deployed frontend will call your local backend through the tunnel.

7. Test

	- Open the Netlify site, perform actions that call the backend (login, list jobs). Confirm requests hit your local backend and ngrok shows the requests.

8. Local dev without ngrok

	- Use `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1` in `frontend/.env` for pure local testing.

9. Commit helpers

	- A `.env.example` is committed for backend and frontend; copy them to `.env` and fill secrets.

10. Notes

	- Backend reads `FRONTEND_URL` and `NGROK_URL` for CORS (see `backend/.env.example`).
	- Keep ngrok running while testing the Netlify-deployed frontend.

If you want, I can run the remaining edits: add frontend/.env.example and a root `.env.example` now.