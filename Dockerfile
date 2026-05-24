FROM node:16-alpine AS build
ENV NODE_OPTIONS="--max_old_space_size=1536"
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/maestria-computacion-front /usr/share/nginx/html
COPY ./src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js
COPY ./init.sh /init.sh
RUN sed -i 's/\r$//' /init.sh && chmod +x /init.sh
ENTRYPOINT ["/init.sh"]
EXPOSE 82
CMD ["nginx", "-g", "daemon off;"]
