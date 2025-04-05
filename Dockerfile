# Base image Node.js versi 14 Alpine (ada batasan 500 MB di GitHub Packages)
FROM node:14-alpine

# Working directory container
WORKDIR /app

# Copy source code ke container
COPY . .

# Env mode production & database host
ENV NODE_ENV=production
ENV DB_HOST=item-db

# Dependencies production & build aplikasi
RUN npm install --production --unsafe-perm && npm run build

# Ekspose port 8080
EXPOSE 8080

# Start server
CMD ["npm", "start"]
