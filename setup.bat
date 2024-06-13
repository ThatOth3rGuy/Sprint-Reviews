@echo off
setlocal

:: Define the NGINX configuration
set "NGINX_CONF=server {"
set "NGINX_CONF=%NGINX_CONF%    listen 80;"
set "NGINX_CONF=%NGINX_CONF%    server_name localhost;"
set "NGINX_CONF=%NGINX_CONF%"
set "NGINX_CONF=%NGINX_CONF%    location / {"
set "NGINX_CONF=%NGINX_CONF%        proxy_pass http://localhost:3001; # Your Node.js app address"
set "NGINX_CONF=%NGINX_CONF%        proxy_http_version 1.1;"
set "NGINX_CONF=%NGINX_CONF%        proxy_set_header Upgrade $http_upgrade;"
set "NGINX_CONF=%NGINX_CONF%        proxy_set_header Connection 'upgrade';"
set "NGINX_CONF=%NGINX_CONF%        proxy_set_header Host $host;"
set "NGINX_CONF=%NGINX_CONF%        proxy_cache_bypass $http_upgrade;"
set "NGINX_CONF=%NGINX_CONF%    }"
set "NGINX_CONF=%NGINX_CONF%"
set "NGINX_CONF=%NGINX_CONF%    location /home/student {"
set "NGINX_CONF=%NGINX_CONF%        proxy_pass http://localhost:3001/home/student; # Student login page"
set "NGINX_CONF=%NGINX_CONF%    }"
set "NGINX_CONF=%NGINX_CONF%"
set "NGINX_CONF=%NGINX_CONF%    location /home/instructor {"
set "NGINX_CONF=%NGINX_CONF%        proxy_pass http://localhost:3001/home/instructor; # Instructor login page"
set "NGINX_CONF=%NGINX_CONF%    }"
set "NGINX_CONF=%NGINX_CONF%}"

:: Write the configuration to the NGINX conf directory
echo %NGINX_CONF% > C:\nginx\conf\myapp.conf

:: Test the configuration and reload NGINX
C:\nginx\nginx.exe -t
C:\nginx\nginx.exe -s reload

endlocal
