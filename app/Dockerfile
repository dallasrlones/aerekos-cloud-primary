FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g serve@14.1.2
COPY --from=builder /app/build /app/build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
