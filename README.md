# Interview Project

## Run backend with Docker

1. Open a terminal and change to the backend folder:

   ```bash
   cd backend
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env.docker
   ```

3. Update `.env.docker` if needed, especially `JWT_SECRET`, `EMAIL_USER`, and `EMAIL_PASSWORD`.

4. Build and start the backend and database containers:

   ```bash
   docker compose up --build
   ```

5. After startup:
   - Backend API is available at `http://localhost:8080`
   - PostgreSQL is available on port `5433`

6. To stop and remove containers:

   ```bash
   docker compose down
   ```

7. To remove the database volume and start clean:

   ```bash
   docker compose down -v
   ```
