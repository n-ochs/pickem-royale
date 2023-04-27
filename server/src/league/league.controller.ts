import { GetCurrentUserId } from '@common/decorators';
import { LeagueDto } from '@league/dto';
import { LeagueService } from '@league/league.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseArrayPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { League } from '@prisma/client';

@Controller('league')
export class LeagueController {
	constructor(private readonly leagueService: LeagueService) {}

	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: LeagueDto, @GetCurrentUserId() userId: number): Promise<void> {
		return this.leagueService.create(dto, userId);
	}

	@Get(':leagueId')
	async getOne(@Param('leagueId', ParseIntPipe) leagueId: number): Promise<League> {
		return this.leagueService.getOne(leagueId);
	}

	@Get()
	async getMany(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) leagueIds: number[]): Promise<League[]> {
		return this.leagueService.getMany(leagueIds);
	}
}
