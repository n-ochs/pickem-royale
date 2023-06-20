import { LoggerService } from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import { StdLeagueType } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class StdLeagueTypeService {
	constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) {}

	/**
	 * Find one Standard League Type
	 *
	 * @param {number} id
	 * @return {*}  {Promise<StdLeagueType>}
	 * @memberof StdLeagueTypeService
	 */
	async findOne(id: number): Promise<StdLeagueType> {
		this.logger.log(`Finding StdLeagueType with id: ${id}`, StdLeagueTypeService.name);
		return this.prisma.stdLeagueType.findFirstOrThrow({ where: { id } });
	}

	/**
	 * Find many Standard League Types with given ids
	 *
	 * @param {number[]} ids
	 * @return {*}  {Promise<StdLeagueType[]>}
	 * @memberof StdLeagueTypeService
	 */
	async findMany(ids: number[]): Promise<StdLeagueType[]> {
		this.logger.log(`Finding StdLeagueTypes with ids: ${ids}`, StdLeagueTypeService.name);
		return this.prisma.stdLeagueType.findMany({ where: { id: { in: ids } } });
	}

	/**
	 * Find all Standard League Types
	 *
	 * @return {*}  {Promise<StdLeagueType[]>}
	 * @memberof StdLeagueTypeService
	 */
	async findAll(): Promise<StdLeagueType[]> {
		this.logger.log('Finding all StdLeagueTypes', StdLeagueTypeService.name);
		return this.prisma.stdLeagueType.findMany();
	}
}
