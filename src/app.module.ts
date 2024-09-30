import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { PeopleModule } from './modules/people/people.module';
import { RedisCacheModule } from './common/redis-cache/redis-cache.module';
import { PlanetsModule } from './modules/planets/planets.module';

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          url: configService.get('REDIS_URI'),
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PeopleModule,
    PlanetsModule,
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
