import * as env from 'env-var';

export default () => ({
  PORT: env.get('PORT').default(3007).asInt(),
  env: env.get('NODE_ENV').default('local').asString(),
  STAR_WAR_API: env.get('STAR_WAR_API').required().asUrlString(),
  REDIS: {
    uri: env.get('REDIS_URI').required().asString(),
    ttl: env.get('REDIS_TTL').required().asInt(),
  },
  THROTTLE: {
    ttl: env.get('THROTTLE_TTL').required().asInt(),
    limit: env.get('THROTTLE_LIMIT').required().asInt(),
  },
});
