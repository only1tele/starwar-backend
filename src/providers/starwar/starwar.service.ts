import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import {
  StarwarPeopleResponse,
  StarwarPeople,
  StarwarPlanetsResponse,
  StarwarPlanet,
} from './starwar.type';

@Injectable()
export class StarWarService {
  readonly name = 'STARWAR';
  private readonly baseURL = this.configService.get('STAR_WAR_API');
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getPeople(page: number = 1, search: string) {
    const response = await lastValueFrom(
      this.httpService.get<StarwarPeopleResponse>(`${this.baseURL}/people`, {
        params: { page, search },
      }),
    );
    return response.data;
  }

  async getPeopleByID(id: string) {
    const response = await lastValueFrom(
      this.httpService.get<StarwarPeople>(`${this.baseURL}/people/${id}`),
    );
    return response.data;
  }

  async getPlanets(page: number = 1, search: string) {
    const response = await lastValueFrom(
      this.httpService.get<StarwarPlanetsResponse>(`${this.baseURL}/planets`, {
        params: { page, search },
      }),
    );
    return response.data;
  }

  async getPlanetByID(id: string) {
    const response = await lastValueFrom(
      this.httpService.get<StarwarPlanet>(`${this.baseURL}/planets/${id}`),
    );
    return response.data;
  }

  async getByUrl<T>(url: string): Promise<T> {
    const response = await lastValueFrom(this.httpService.get<T>(url));
    return response.data;
  }
}
