# Step 1: Base Image
FROM node:20

# Step 2: Set Working Directory
WORKDIR /app

# Step 3: Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Step 4: Copy all files
COPY . .

# Step 5: Run dev server
CMD ["npm", "run", "dev"]

# Expose port
EXPOSE 5173
