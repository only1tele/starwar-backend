import { Injectable } from '@nestjs/common';
import { StarWarService } from 'src/providers/starwar/starwar.service';

@Injectable()
export class PeopleService {
  constructor(private readonly starWarService: StarWarService) {}
}
