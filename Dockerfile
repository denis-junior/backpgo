FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Limpar cache do npm e instalar dependências
RUN npm cache clean --force
RUN npm install --verbose

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando para iniciar
CMD ["npm", "start"]