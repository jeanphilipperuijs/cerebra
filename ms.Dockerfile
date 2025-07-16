FROM node:22-bookworm-slim

WORKDIR /app

COPY src/ /app/src/
COPY package*.json /app/
COPY *.js /app/
COPY index.html /app/

RUN npm install
RUN npm run build


FROM nginxinc/nginx-unprivileged:stable-alpine
USER root
# Create a non-root user
RUN adduser -D -g '' nginxuser

# Remove default web files
RUN rm -rf /usr/share/nginx/html/*

# Copy your built app
#COPY --chown=nginxuser:nginxuser dist/ /usr/share/nginx/html
COPY --from=0 --chown=nginxuser:nginxuser /app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop to non-root user
USER nginxuser

# Listen on a high port to avoid root requirement
EXPOSE 8080

# Tell nginx to use custom config
CMD ["nginx", "-g", "daemon off;"]
