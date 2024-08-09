# With Docker Compose

This example contains everything needed to get a Next.js development and production environment up and running with Docker Compose.

## Benefits of Docker Compose

- Develop locally without Node.js or TypeScript installed ✨
- Easy to run, consistent development environment across macOS, Windows, and Linux teams
- Run multiple Next.js apps, databases, and other microservices in a single deployment
- Multistage builds combined with [Output Standalone](https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files) outputs up to 85% smaller apps (Approximately 110 MB compared to 1 GB with create-next-app)
- Easy configuration with YAML files 

## How to use 
## Prerequisites

Install [Docker Desktop](https://docs.docker.com/get-docker) for Mac, Windows, or Linux. Docker Desktop includes Docker Compose as part of the installation.

## Development
This is to be used for local server development. For Docker Deployed Server use **Production**
First, run the development MySQL server:

```bash
# Docker creates and manages the custom network, which allows containers to communicate via the internal port
# For development only the Database is needed to be running on Docker.

# Build the development containers. ONLY run this command if you wish to build testing containers as well!
docker compose -f dev.yml build 

# To Build Only the containers required for running the LOCAL web server, USE:
docker compose -f dev.yml build app
# This will build the app container, network connection, and MySQL Server ONLY.

# Run the MySQL Server and Database Init
docker compose -f dev.yml up db 
#If you wish to continue using the console add: "-d" to the end
```
Now run the Next Dev server on Localhost

```bash
# Navigate to the app directory:
cd app

#Run dev server:
npm run dev

# (Optional) If any dependancies are missing or version changes, update package contents in the app directory:
npm install
```
Development server uses the default localhost, and database port (:3000 and :3306 respectively)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The server landing page defaults to `pages/index.tsx`. The page auto-updates as you edit the file.

For Test Configuration please refer to README in 'app/server-test/README.md'


## Production

Multistage builds are highly recommended in production. Combined with the Next [Output Standalone](https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files) feature, only `node_modules` files required for production are copied into the final Docker image.

The Production Server is to be used for full server deployment via Docker, and may not include Testing or Dynamic Refresh.
To Start the Production Server on Docker:
```bash
# Docker creates and manages the custom network, which allows containers to communicate via the internal port
# For Production the Database and App are both required to be running on Docker.

# Build the server containers. ONLY run this command if you wish to build testing containers as well!
docker compose -f dev.yml build 

# (RECOMMENDED) To Build Only the containers required for running the deployed web server, USE:
docker compose -f prod.yml build
# This will build the app container, network connection, and MySQL Server ONLY.

# Run the MySQL and App Servers
docker compose -f prod.yml up
#If you wish to continue using the console add: "-d" to the end
```
The Deployed Server Host uses a custom port for client connection, while the default port is used for internal container communication
To View the App Open [http://localhost:3001](http://localhost:3001).

To run testing please see README in the 'Server-test' directory
## Useful commands

```bash
# Stop all running containers
docker kill $(docker ps -aq) && docker rm $(docker ps -aq)

# Free space
docker system prune -af --volumes
```
