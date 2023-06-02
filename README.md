# Totem Core Explorer API

Totem Core Explorer API service provide an API gateway for 
the [Totem Core Explorer Backend](https://github.com/Totem-gdn/totem-core-explorer-backend) service.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create [Redis](https://redis.io/docs/stack/get-started/install/docker/) in Docker, or use local variant.
3. Create `.env` file from example `.env.sample` and fill in environment variables:
   ```dotenv
    PORT=3000
    REDIS_URL=redis://127.0.0.1:6379/0
    EXPLORER_BACKEND_URL=127.0.0.1:50051
   ```
4. Run service in development mode:
   ```bash
   npm run start:dev
   ```
   Debug mode:
   ```bash
   npm run start:debug
   ```
   If Node.js default debug port `9229` is busy -- you can change it like this:
   ```bash
   npm run start:debug -- --debug 0.0.0.0:9228
   ```

## Build without Docker

1. Build service with version ([git](https://git-scm.com/) required):
   ```bash
   npm run build
   ```
   Build service without version (without git):
   ```bash
   npm run build:app
   ```
2. Run service:
   ```bash
   node dist/main
   ```

## Build with Docker

1. Build docker image:
   ```bash
   docker build -f deployment/docker/Dockerfile -t totem-core-explorer-api:latest .
   ```
