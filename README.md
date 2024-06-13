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

First, run the development server:

```bash
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname

docker network create my_network

# Build dev
docker compose -f dev.yml build 
# IF YOU WISH TO BUILD BOTH THE DEV AND TEST CONTAINERS
# Otherwise:
docker compose -f dev.yml build app
# Up dev
docker compose -f dev.yml up 
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Production

Multistage builds are highly recommended in production. Combined with the Next [Output Standalone](https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files) feature, only `node_modules` files required for production are copied into the final Docker image.

First, run the production server (Final image approximately 110 MB).

```bash
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create my_network

# Build prod
docker compose -f prod.yml build

# Up prod in detached mode
docker compose -f prod.yml up -d
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
# Stop all running containers
docker kill $(docker ps -aq) && docker rm $(docker ps -aq)

# Free space
docker system prune -af --volumes
```


# NGINX Setup
1. Install NGINX on your machine.
2. Clone this repository.
3. Navigate to the repository directory.
4. Run the `setup.bat` script to set up the NGINX configuration:
   ```bash
   setup.bat
5. To test config : `nginx -t`
6. To run config : `nginx -s reload`
7. Open `http://localhost:3001`
8. 

If that build is not possible follow these steps for manual build:

## Prerequisites
- Node.js
- Docker (if your application is containerized)


#### Manual Installation of NGINX on Windows
1. Visit the NGINX download page at `https://nginx.org/en/download.html` and download the latest mainline version of NGINX for Windows.
2. Once the download is complete, extract the files from the downloaded archive to a directory on your computer. For example, you might extract the files to `D:\nginx`.
3. Open a command prompt and navigate to the directory where you extracted the files. Run the command `start nginx`. Then, open a web browser and navigate to `http://localhost`. If you see a welcome page, NGINX is running correctly.

#### NGINX Configuration
1. In the `conf` directory inside your NGINX directory (for example, `D:\nginx\conf`), create a new file named `myapp.conf`. This file will contain the server block that defines how to handle incoming requests and redirect them based on the user role (student or instructor).
2. Open the `myapp.conf` file and add the following server block:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:3001; # Your Node.js app address
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /home/student {
        proxy_pass http://localhost:3001/home/student; # Student login page
    }

    location /home/instructor {
        proxy_pass http://localhost:3001/home/instructor; # Instructor login page
    }
}
```
3. Open the `nginx.conf` file in the conf directory. Inside the http block, include the `myapp.conf` file by adding the line include `/path/to/myapp.conf`;, replacing `/path/to/` with the actual path to the `myapp.conf` file.
4. In the command prompt, navigate to your NGINX directory and run the command `.\nginx -t` to test your configuration file. If the test is successful, run the command `.\nginx -s reload` to apply the changes.