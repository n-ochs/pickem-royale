import { Module } from '@nestjs/common';
import { StdLeagueTypeService, StdSportService } from '@std/services';
import { StdController } from '@std/std.controller';
import { StdService } from '@std/std.service';

@Module({
	controllers: [StdController],
	providers: [StdService, StdSportService, StdLeagueTypeService]
})
export class StdModule {}
