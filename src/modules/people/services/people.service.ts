import { Injectable } from '@nestjs/common';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { StarwarPeople } from 'src/providers/starwar/starwar.type';
import { extractIdFromUrl, extractPageNumber } from 'src/utils/pagination.util';
import { PaginatedPeopleResponse, PeopleBase } from '../dtos/people';

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
}
