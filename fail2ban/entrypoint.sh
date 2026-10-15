#!/bin/sh
set -e

mkdir -p /var/log/nginx /var/run/fail2ban
touch /var/log/nginx/access.log /var/log/nginx/error.log

# Iniciar Express en el puerto interno 3002
PORT=3002 node /app/src/server.js &
NODE_PID=$!

# Iniciar Fail2ban
fail2ban-server -f -x &
FAIL2BAN_PID=$!

# Iniciar Nginx en el puerto 3001
nginx -g 'daemon off;' &
NGINX_PID=$!

cleanup() {
    kill "$NGINX_PID" "$FAIL2BAN_PID" "$NODE_PID" 2>/dev/null || true
}

trap cleanup TERM INT

wait "$NGINX_PID"

