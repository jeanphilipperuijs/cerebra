FROM nginx:alpine

# Create a non-root user
RUN adduser -D -g '' nginxuser

# Remove default web files
RUN rm -rf /usr/share/nginx/html/*

# Copy your built app
COPY --chown=nginxuser:nginxuser dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop to non-root user
USER nginxuser

# Listen on a high port to avoid root requirement
EXPOSE 8080

# Tell nginx to use custom config
CMD ["nginx", "-g", "daemon off;"]
