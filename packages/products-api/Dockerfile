###################
# BUILD
###################

FROM node:18-alpine As build

RUN yarn global add @nestjs/cli

# https://btholt.github.io/complete-intro-to-containers/build-a-nodejs-app
USER node

# Create app directory
WORKDIR /app

# Bundle app source
COPY --chown=node:node . .

# Install app dependencies
RUN yarn --frozen-lockfile

# build it
RUN yarn build

###################
# PREPARE FINAL
###################

# Base image for production
FROM node:18-alpine As production

# Copy package files
COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

# Copy the bundled built code to the production image
COPY --chown=node:node --from=build /app/dist ./dist

# grab the required packages for running app
RUN yarn --production --frozen-lockfile
RUN yarn cache clean --force

EXPOSE 80
# Start the server using the production build
CMD [ "node", "dist/main.js" ]