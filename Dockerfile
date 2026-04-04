# ===== BUILD =====
FROM node:20-alpine AS build

WORKDIR /app

# ⚡ chỉ copy package để tận dụng cache
COPY package*.json ./

# ⚡ cài nhanh + nhẹ
RUN npm install --legacy-peer-deps

# copy source
COPY . .

# build production
RUN npm run build


# ===== RUN =====
FROM nginx:alpine

# xóa config mặc định
RUN rm -rf /etc/nginx/conf.d/default.conf

# copy build từ stage trên
COPY --from=build /app/build /usr/share/nginx/html

# config nginx cho React SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]