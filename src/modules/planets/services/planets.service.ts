import { Injectable } from '@nestjs/common';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { extractIdFromUrl, extractPageNumber } from 'src/utils/pagination.util';
import { PaginatedPlanetResponse, Planet, PlanetBase } from '../dtos/planets';
import {
  StarwarFilm,
  StarwarPeople,
  StarwarPlanet,
} from 'src/providers/starwar/starwar.type';
import { ParamIdDto } from 'src/common/dtos/param.dto';

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

  async getPlanetById(params: ParamIdDto): Promise<Planet> {
    const cacheKey = `planet_${params.id}`;

    const cachedData = await this.redisCacheService.get(cacheKey);
    if (cachedData) return cachedData;
    const planet = await this.starWarService.getPlanetByID(params.id);
    const [residents, films] = await Promise.all([
      this.fetchResidents([...planet.residents, 'sssss']),
      this.fetchFilms(planet.films),
    ]);
    const planetWithDetails = this.mapToPlanet({
      ...planet,
      residents,
      films,
    });
    await this.redisCacheService.set(cacheKey, planetWithDetails, 300);
    return planetWithDetails;
  }

  private async fetchResidents(residents: string[]): Promise<string[]> {
    const residentPromises = residents.map((url) =>
      this.starWarService.getByUrl<StarwarPeople>(url).catch(() => null),
    );
    const residentResults = await Promise.all(residentPromises);
    return residentResults
      .filter(Boolean)
      .map((resident: StarwarPeople) => resident.name);
  }

  private async fetchFilms(films: string[]): Promise<string[]> {
    const filmPromises = films.map((url) =>
      this.starWarService.getByUrl<StarwarFilm>(url).catch(() => null),
    );
    const filmResults = await Promise.all(filmPromises);
    return filmResults.filter(Boolean).map((film: StarwarFilm) => film.title);
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

  private mapToPlanet(planet: StarwarPlanet) {
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
      residents: planet.residents,
      films: planet.films,
    } as Planet;
  }
}
