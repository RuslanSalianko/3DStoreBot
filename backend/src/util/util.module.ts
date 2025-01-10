import { Global, Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { DateService } from './services/date.service';

@Global()
@Module({
  providers: [FileService, DateService],
  exports: [FileService, DateService],
})
export class UtilModule {}
