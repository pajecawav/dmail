# build image
FROM node:16-alpine AS build

ENV DATABASE_URL "file:/app/db/db.db"

WORKDIR /build

COPY package.json yarn.lock /build/

# install production dependencies
RUN yarn install --production --frozen-lockfile

# cache production dependencies
RUN cp -R node_modules/ prod_node_modules/

# install development dependencies
RUN yarn install --frozen-lockfile

COPY . /build
RUN yarn prisma generate
RUN yarn next telemetry disable
RUN yarn build


# production image
FROM node:16-alpine
WORKDIR /app

# copy cached production dependencies
COPY --from=build /build/prod_node_modules ./node_modules

# copy files from build image
COPY --from=build /build/node_modules/.prisma/ ./node_modules/.prisma/
COPY --from=build /build/yarn.lock /build/package.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/prisma ./prisma

EXPOSE 3000
CMD ["yarn", "start"]
