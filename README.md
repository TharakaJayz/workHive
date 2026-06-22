# workHive

## Backend Docker setup

To run the backend with Docker using the current configuration:

1. Copy the example env file into the backend folder.
   - This creates the required runtime and database variables for Docker.
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Fill in your values in `backend/.env`.
   - Make sure `JWT_SECRET`, `EMAIL_USER`, and `EMAIL_PASSWORD` are set.
   - The Postgres values are already configured for Docker.

3. Start the backend and database together.
   - This builds the backend image, applies Prisma migrations, and runs the seed step.
   ```bash
   cd backend
   docker compose up --build
   ```

4. Open the backend API.
   - The service is available at `http://localhost:8080`.

5. Stop the services when finished.
   ```bash
   docker compose down
   ```


## Backend  setup

1. npm install 

2. npm run dev