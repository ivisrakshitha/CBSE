# Use nginx as the base image
FROM nginx:stable-alpine

# Copy the built app to nginx's serve directory
COPY ./dist /usr/share/nginx/html

# Copy custom nginx configuration (we'll create this next)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 5100

# Start nginx
CMD ["nginx", "-g", "daemon off;"]