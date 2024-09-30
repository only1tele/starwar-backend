import { Injectable } from '@nestjs/common';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

@Injectable()
export class PlanetsService {
  constructor(
    private readonly starWarService: StarWarService,
    private readonly redisCacheService: RedisCacheService,
  ) {}
}
