import * as env from 'env-var';

export default () => ({
  PORT: env.get('PORT').default(3007).asInt(),
  env: env.get('NODE_ENV').default('local').asString(),
  STAR_WAR_API: env.get('STAR_WAR_API').required().asUrlString(),
  REDIS_URI: env.get('REDIS_URI').required().asString(),
});
