# Menggunakan base image alpine
FROM node:18-alpine

# Direktori aktif
WORKDIR /src

# Mengkopi file package.json dan package-lock.json ke direktori aktif
COPY package*.json ./

# Install dependency
RUN npm ci

# Mengkopi semua file project ke direktori aktif
COPY . ./

# Menginstall bash (default tidak ada bash di alpine)
RUN apk add --no-cache bash

# Download script wait-for-it.sh
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh

# Menambah permission execute agar bisa dijalankan
RUN chmod +x /bin/wait-for-it.sh

# Membuka port 3000 agar bisa diakses dari luar container
EXPOSE 3000

# Menjalankan file index.js
CMD ["node", "index.js"]
