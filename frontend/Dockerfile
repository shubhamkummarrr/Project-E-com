FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve build using vite preview
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
