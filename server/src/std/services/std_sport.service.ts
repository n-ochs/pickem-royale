import { LoggerService } from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import { StdSport } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class StdSportService {
	constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) {}

	/**
	 * Find one Standard Sport
	 *
	 * @param {number} id
	 * @return {*}  {Promise<StdSport>}
	 * @memberof StdSportService
	 */
	async findOne(id: number): Promise<StdSport> {
		this.logger.log(`Finding StdSport with id: ${id}`, StdSportService.name);
		return this.prisma.stdSport.findFirstOrThrow({ where: { id } });
	}

	/**
	 * Find many Standard Sports with given ids
	 *
	 * @param {number[]} ids
	 * @return {*}  {Promise<StdSport[]>}
	 * @memberof StdSportService
	 */
	async findMany(ids: number[]): Promise<StdSport[]> {
		this.logger.log(`Finding StdSports with ids: ${ids}`, StdSportService.name);
		return this.prisma.stdSport.findMany({ where: { id: { in: ids } } });
	}

	/**
	 * Find all Standard Sports
	 *
	 * @return {*}  {Promise<StdSport[]>}
	 * @memberof StdSportService
	 */
	async findAll(): Promise<StdSport[]> {
		this.logger.log('Finding all StdSports', StdSportService.name);
		return this.prisma.stdSport.findMany();
	}
}
