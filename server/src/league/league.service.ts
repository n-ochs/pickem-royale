import { CreateLeagueDto } from '@league/dto';
import { LoggerService } from '@logger/logger.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { League } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class LeagueService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: LoggerService
	) {}

	/**
	 * Creates a new league
	 *
	 * @param {CreateLeagueDto} dto
	 * @param {number} userId
	 * @return {*}  {Promise<void>}
	 * @memberof LeagueService
	 */
	async create(dto: CreateLeagueDto, userId: number): Promise<void> {
		this.logger.verbose(`Creating league '${dto.name}' for userId ${userId}`, LeagueService.name);

		try {
			await this.prisma.league.create({
				data: {
					name: dto.name,
					ownerId: userId,
					createdBy: userId,
					isPublic: dto.isPublic,
					sportId: dto.sportId,
					leagueTypeId: dto.leagueTypeId
				}
			});
			this.logger.verbose(`Successfully created league '${dto.name}' for userId ${userId}`, LeagueService.name);
		} catch (error) {
			this.logger.error(`Problem creating league '${dto.name}' for userId ${userId}`, LeagueService.name);
			throw new BadRequestException('Problem creating league. Please try again or contact support.');
		}

		return;
	}

	/**
	 * Retreives one league data from DB
	 *
	 * @param {number} leagueId
	 * @return {*}  {Promise<League>}
	 * @memberof LeagueService
	 */
	async findOne(leagueId: number): Promise<League> {
		this.logger.verbose(`Getting league data for leagueId '${leagueId}'`, LeagueService.name);

		// make sure user belongs to league or has certain privs or league is public. maybe make this a separate function

		const league: League = await this.prisma.league.findUnique({
			where: {
				id: leagueId
			},
			include: {
				sport: true,
				leagueType: true
			}
		});

		if (!league) {
			this.logger.error(`Problem getting league data for leagueId '${leagueId}'. League does not exist.`, LeagueService.name);
			throw new NotFoundException('Problem getting league data. League does not exist.');
		}

		this.logger.verbose(`Successfully retreived league data for leagueId '${leagueId}'`, LeagueService.name);
		return league;
	}

	/**
	 * Retreives multiple league data from DB
	 *
	 * @param {number[]} leagueIds
	 * @return {*}  {Promise<League[]>}
	 * @memberof LeagueService
	 */
	async findMany(leagueIds: number[]): Promise<League[]> {
		this.logger.verbose(`Getting league data for leagueIds '${leagueIds}'`, LeagueService.name);

		// make sure user belongs to league or has certain privs or league is public. maybe make this a separate function

		const leagues: League[] = await this.prisma.league.findMany({
			where: {
				id: { in: leagueIds }
			},
			include: {
				sport: true,
				leagueType: true
			}
		});

		if (!leagues || leagues?.length < 1 || leagues?.length !== leagueIds.length) {
			this.logger.error(`Problem getting league data for leagueIds '${leagueIds}'. One or more leagues may not exist.`, LeagueService.name);
			throw new NotFoundException('Problem getting league data. One or more leagues may not exist.');
		}

		this.logger.verbose(`Successfully retreived league data for leagueIds '${leagueIds}'`, LeagueService.name);
		return leagues;
	}

	/**
	 * Retreives all league data from DB
	 *
	 * @param {boolean} isPublic
	 * @return {*}  {Promise<League[]>}
	 * @memberof LeagueService
	 */
	async findAll(isPublic: boolean): Promise<League[]> {
		this.logger.verbose('Getting all league data', LeagueService.name);

		// check privileges

		const leagues: League[] = await this.prisma.league.findMany({ where: { isPublic }, include: { sport: true, leagueType: true } });

		if (!leagues || leagues?.length < 1) {
			this.logger.error('Problem getting league data', LeagueService.name);
			throw new NotFoundException('Problem getting league data.');
		}

		this.logger.verbose('Successfully retreived all league data', LeagueService.name);
		return leagues;
	}
}
