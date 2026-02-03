FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Expõe a porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
