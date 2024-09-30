FROM node:20.5-slim AS backend_build
WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --omit=dev

# release image

FROM node:20.5-slim AS release

WORKDIR /app

COPY --from=backend_build /app/package*.json ./
COPY --from=backend_build /app/node_modules/ ./node_modules/

# Add user so we don't need --no-sandbox.
RUN addgroup --system jedi && adduser --system --ingroup jedi yoda \
    && mkdir -p /home/yoda/Downloads /app \
    && chown -R yoda /home/yoda \
    && chown -R yoda /app

# Run everything after as non-privileged user.
USER yoda

COPY --from=backend_build /app/dist ./

CMD ["node", "main.js"]

