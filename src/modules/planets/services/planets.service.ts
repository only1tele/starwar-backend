import { Injectable } from '@nestjs/common';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { extractIdFromUrl, extractPageNumber } from 'src/utils/pagination.util';
import { PaginatedPlanetResponse, PlanetBase } from '../dtos/planets';
import { StarwarPlanet } from 'src/providers/starwar/starwar.type';

@Injectable()
export class PlanetsService {
  constructor(
    private readonly starWarService: StarWarService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async getPlanets(
    page: number,
    search: string,
  ): Promise<PaginatedPlanetResponse> {
    const cacheKey = `planets_page_${page}`;

    const cachedData = await this.redisCacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const data = await this.starWarService.getPlanets(page, search);
    const paginatedResponse: PaginatedPlanetResponse = {
      count: data.count,
      next: extractPageNumber(data.next),
      prev: extractPageNumber(data.previous),
      results: data.results.map(this.mapToPlanetBase),
    };

    await this.redisCacheService.set(cacheKey, paginatedResponse, 300);

    return paginatedResponse;
  }

  private mapToPlanetBase(planet: StarwarPlanet) {
    return {
      id: extractIdFromUrl(planet.url),
      name: planet.name,
      rotation_period: planet.rotation_period,
      orbital_period: planet.orbital_period,
      diameter: planet.diameter,
      climate: planet.climate,
      gravity: planet.gravity,
      terrain: planet.terrain,
      surface_water: planet.surface_water,
      population: planet.population,
    } as PlanetBase;
  }
}
