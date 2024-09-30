import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlanetsService } from '../services/planets.service';

@Controller('planets')
@ApiTags('Planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}
}
