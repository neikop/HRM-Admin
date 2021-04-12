FROM node:14.15.3-alpine as builder

WORKDIR /client

COPY ./package.json ./package.json

COPY ./package-lock.json ./package-lock.json

RUN npm install --silent

COPY ./ ./

RUN npm run build

FROM nginx:1.13.9-alpine

WORKDIR /server

COPY --from=builder /client/build /client/build

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
