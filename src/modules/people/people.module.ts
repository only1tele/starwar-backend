import { Module } from '@nestjs/common';
import { PeopleService } from './services/people.service';
import { PeopleController } from './controllers/people.controller';

@Module({
  providers: [PeopleService],
  controllers: [PeopleController],
  exports: [PeopleService],
})
export class PeopleModule {}
