# 1️⃣ Use Node.js 20 as the base image for building
FROM node:20-alpine AS builder

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# 4️⃣ Install ALL dependencies (including devDependencies)
RUN npm install

# 5️⃣ Copy the entire project
COPY . .

# 6️⃣ Copy the Docker-specific .env file
COPY .env .env

# 7️⃣ Build the Next.js application
RUN npm run build

# 8️⃣ Use a minimal Node.js 20 image for the final production container
FROM node:20-alpine AS runner

# 9️⃣ Set working directory
WORKDIR /app

# 🔟 Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env .env

# 1️⃣1️⃣ Expose the Next.js port
EXPOSE 4000

# 1️⃣2️⃣ Start the Next.js application
CMD ["sh", "-c", "PORT=$PORT NEXTAUTH_URL=$NEXTAUTH_URL NEXTAUTH_SECRET=$NEXTAUTH_SECRET DB_HOST=$DB_HOST DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_PORT=$DB_PORT npm run start"]