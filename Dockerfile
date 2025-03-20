# Usa un'immagine Node.js per la build
FROM node:14.15.0-alpine AS build

# Imposta la cartella di lavoro
WORKDIR /app

# Copia solo i file necessari per l'installazione delle dipendenze
COPY package*.json ./

# Installa le dipendenze direttamente nel container
RUN npm install --force

# Copia il resto del codice
COPY . .

# Compila l'app (se necessario)
RUN npm run build

# Secondo stage: esecuzione
FROM node:14.15.0-alpine
WORKDIR /app

# Copia solo i file necessari per l'esecuzione
COPY --from=build /app ./

# Assicurati di reinstallare le dipendenze senza rigenerare i moduli nativi
RUN npm rebuild bcrypt --force

# Espone la porta dell'app
EXPOSE 8081

# Comando di avvio
CMD [ "npm", "start" ]
