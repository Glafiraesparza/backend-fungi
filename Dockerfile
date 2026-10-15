
FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        fail2ban \
        nginx \
        iptables \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY data ./data

COPY fail2ban/filter-http-flood.conf /etc/fail2ban/filter.d/http-flood.conf
COPY fail2ban/jail.local /etc/fail2ban/jail.local
COPY fail2ban/nginx.conf /etc/nginx/nginx.conf
COPY fail2ban/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 3001

CMD ["/entrypoint.sh"]

