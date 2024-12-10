FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
# Expose the port the app runs on
EXPOSE 3000
CMD ["npx", "nodemon", "index.js"]