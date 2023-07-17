import { LoggerService } from '@logger/logger.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
	providers: [LoggerService],
	exports: [LoggerService]
})
export class LoggerModule {}
