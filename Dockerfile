FROM node:22 AS builder

WORKDIR /app

COPY ./backend /app/backend
COPY ./frontend /app/frontend

WORKDIR /app/backend
RUN npm install
RUN npx prisma generate
RUN npm run build

WORKDIR /app/frontend 

RUN npm install
RUN npm run build

FROM node:22.12.0-alpine AS production
RUN apk add --no-cache openssl

WORKDIR /app
RUN npm install -g prisma

COPY --from=builder /app/backend ./backend

COPY --from=builder /app/frontend/dist ./backend/dist/static

WORKDIR /app/backend
RUN npm install --production

EXPOSE 5000

CMD ["bash", "-c", "prisma migrate deploy && npm run start:prod"]
