import { Module } from '@nestjs/common';
import { StdSportService } from '@std/services';
import { StdController } from '@std/std.controller';
import { StdService } from '@std/std.service';

@Module({
	controllers: [StdController],
	providers: [StdService, StdSportService]
})
export class StdModule {}
