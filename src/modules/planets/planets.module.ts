import { Module } from '@nestjs/common';
import { ProvidersModule } from 'src/providers/providers.module';
import { PlanetsController } from './controllers/planets.controller';
import { PlanetsService } from './services/planets.service';

@Module({
  imports: [ProvidersModule],
  providers: [PlanetsService],
  controllers: [PlanetsController],
  exports: [PlanetsService],
})
export class PlanetsModule {}
