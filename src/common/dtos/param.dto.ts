import { IsString } from 'class-validator';
import { ApiParam } from '@nestjs/swagger';

export class ParamIdDto {
  @IsString()
  id: string;
}
