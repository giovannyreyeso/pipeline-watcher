FROM node:8.12.0 as builder

ADD . /root/pipeline-watch
WORKDIR /root/pipeline-watch

RUN npm install

FROM keymetrics/pm2:8-jessie
WORKDIR /root/pipeline-watch

COPY --from=builder /root/pipeline-watch /root/pipeline-watch

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}
EXPOSE 3000
CMD ["sh", "-c", "pm2-runtime /root/pipeline-watch/ecosystem.config.js --env ${NODE_ENV}"]
