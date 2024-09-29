import { Module } from '@nestjs/common';
import { PeopleService } from './services/people.service';
import { PeopleController } from './controllers/people.controller';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [PeopleController],
  exports: [PeopleService],
  providers: [PeopleService],
})
export class PeopleModule {}
