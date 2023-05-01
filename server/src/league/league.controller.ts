import { GetCurrentUserId } from '@common/decorators';
import { CreateLeagueDto } from '@league/dto';
import { LeagueService } from '@league/league.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseArrayPipe, ParseBoolPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { League } from '@prisma/client';

@Controller('league')
export class LeagueController {
	constructor(private readonly leagueService: LeagueService) {}

	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateLeagueDto, @GetCurrentUserId() userId: number): Promise<void> {
		return this.leagueService.create(dto, userId);
	}

	@Get('all')
	async findAll(@Query('p', ParseBoolPipe) isPublic: boolean): Promise<League[]> {
		return this.leagueService.findAll(isPublic);
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) leagueId: number): Promise<League> {
		return this.leagueService.findOne(leagueId);
	}

	@Get()
	async findMany(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) leagueIds: number[]): Promise<League[]> {
		return this.leagueService.findMany(leagueIds);
	}
}
