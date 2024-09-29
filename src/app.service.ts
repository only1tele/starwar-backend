import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<'status', string> {
    return {
      status: 'ONLINE',
    };
  }
}
