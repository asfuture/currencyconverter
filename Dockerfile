FROM node:latest as currencyconverter
WORKDIR /app
COPY package.json  /app
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=currencyconverter app/dist/currencyconverter/browser /usr/share/nginx/html
COPY ./config/nginx.conf etc/nginx/conf.d/default.conf

# docker build -t currencyconverter .
# docker run -p 8080:80 currencyconverter
