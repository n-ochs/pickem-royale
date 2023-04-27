import { LeagueController } from '@league/league.controller';
import { LeagueService } from '@league/league.service';
import { Module } from '@nestjs/common';

@Module({
	controllers: [LeagueController],
	providers: [LeagueService]
})
export class LeagueModule {}
