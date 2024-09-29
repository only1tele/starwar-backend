import { Injectable } from '@nestjs/common';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import {
  StarwarFilm,
  StarwarPeople,
  StarwarPlanet,
  StarwarShip,
  StarwarVehicle,
} from 'src/providers/starwar/starwar.type';
import { extractIdFromUrl, extractPageNumber } from 'src/utils/pagination.util';
import { PaginatedPeopleResponse, People, PeopleBase } from '../dtos/people';
import { ParamIdDto } from 'src/common/dtos/param.dto';

@Injectable()
export class PeopleService {
  constructor(private readonly starWarService: StarWarService) {}

  async getPeople(
    page: number,
    search?: string,
  ): Promise<PaginatedPeopleResponse> {
    const data = await this.starWarService.getPeople(page, search);

    const paginatedResponse: PaginatedPeopleResponse = {
      count: data.count,
      next: extractPageNumber(data.next),
      prev: extractPageNumber(data.previous),
      results: data.results.map(this.mapToPeopleBase),
    };

    return paginatedResponse;
  }

  async getPersonById(params: ParamIdDto): Promise<People> {
    const person = await this.starWarService.getPeopleByID(params.id);
    const [films, starships, vehicles, homeworld] = await Promise.all([
      this.fetchFilms(person.films),
      this.fetchStarships(person.starships),
      this.fetchVehicles(person.vehicles),
      this.fetchHomeworld(person.homeworld),
    ]);

    const peopleWithDetails = this.mapToPeople({
      ...person,
      homeworld,
      films,
      vehicles,
      starships,
    });

    return peopleWithDetails;
  }

  private async fetchVehicles(residents: string[]): Promise<string[]> {
    const vehiclePromises = residents.map((url) =>
      this.starWarService.getByUrl<StarwarVehicle>(url).catch(() => null),
    );
    const vehicleResults = await Promise.all(vehiclePromises);
    return vehicleResults
      .filter(Boolean)
      .map((vehicle: StarwarVehicle) => vehicle.name);
  }

  private async fetchStarships(residents: string[]): Promise<string[]> {
    const shipPromises = residents.map((url) =>
      this.starWarService.getByUrl<StarwarShip>(url).catch(() => null),
    );
    const shipResults = await Promise.all(shipPromises);
    return shipResults.filter(Boolean).map((ship: StarwarShip) => ship.name);
  }

  private async fetchFilms(films: string[]): Promise<string[]> {
    const filmPromises = films.map((url) =>
      this.starWarService.getByUrl<StarwarFilm>(url).catch(() => null),
    );
    const filmResults = await Promise.all(filmPromises);
    return filmResults.filter(Boolean).map((film: StarwarFilm) => film.title);
  }

  private async fetchHomeworld(url: string): Promise<string> {
    const homeworld = await this.starWarService
      .getByUrl<StarwarPlanet>(url)
      .catch(() => null);
    return homeworld.name;
  }

  private mapToPeopleBase(person: StarwarPeople) {
    return {
      id: extractIdFromUrl(person.url),
      name: person.name,
      height: person.height,
      mass: person.mass,
      hair_color: person.hair_color,
      skin_color: person.skin_color,
      eye_color: person.eye_color,
      birth_year: person.birth_year,
      gender: person.gender,
      created: person.created,
    } as PeopleBase;
  }

  private mapToPeople(person: StarwarPeople) {
    return {
      id: extractIdFromUrl(person.url),
      name: person.name,
      height: person.height,
      mass: person.mass,
      hair_color: person.hair_color,
      skin_color: person.skin_color,
      eye_color: person.eye_color,
      birth_year: person.birth_year,
      gender: person.gender,
      homeworld: person.homeworld,
      films: person.films,
      vehicles: person.vehicles,
      starships: person.starships,
      created: person.created,
    } as People;
  }
}
