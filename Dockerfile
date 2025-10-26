FROM mcr.microsoft.com/playwright:v1.47.0-jammy

WORKDIR /tests
COPY package*.json ./
RUN npm ci

COPY . .

ENV BASE_URL=http://frontend:8080
ENV API_URL=http://backend:3000/api
ENV HEADLESS=true

CMD ["sh", "-lc", "npm run test"]
