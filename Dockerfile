# Stage 1: Build
FROM node:20 AS build

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using pnpm
RUN npm i -g pnpm
RUN pnpm i

# Copy app source code
COPY . .

# Build the app
RUN npm run build

##################

# Stage 2: Production
FROM node:20 AS production

# Create app directory
WORKDIR /usr/src/app

# Copy only the dist folder from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy node_modules and package.json from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
