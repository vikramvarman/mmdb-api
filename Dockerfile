FROM node:16 AS builder

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

# Copy project files into the docker image
COPY . /app/


RUN npm run build

FROM node:16
COPY --from=builder /app /app
WORKDIR /app


EXPOSE 3000
RUN npm run prisma-gen-client
CMD npm run start