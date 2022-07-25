
FROM node:18-alpine As build

USER node

# Create app directory
WORKDIR /app

# Bundle app source
COPY --chown=node:node . .

# Install app dependencies
RUN yarn --frozen-lockfile

RUN yarn cache clean --force

EXPOSE 80

CMD ["yarn", "hostProd"]