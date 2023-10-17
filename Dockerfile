FROM node:19.6-slim

WORKDIR /

COPY . /

RUN npm install
RUN npm run build

EXPOSE 3200

ENTRYPOINT [ "npm" ]
CMD ["run", "start"]