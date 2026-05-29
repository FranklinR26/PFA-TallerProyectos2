FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
# Sirve el build de producción en el puerto 5173 (coincide con .greenframe.yml).
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
