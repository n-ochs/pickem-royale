import { LeagueDto } from '@league/dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { League } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class LeagueService {
	private readonly logger: Logger = new Logger(LeagueService.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Creates a new league
	 *
	 * @param {LeagueDto} dto
	 * @param {number} userId
	 * @return {*}  {Promise<void>}
	 * @memberof LeagueService
	 */
	async create(dto: LeagueDto, userId: number): Promise<void> {
		this.logger.verbose(`Creating league '${dto.name}' for userId ${userId}`);

		try {
			await this.prisma.league.create({
				data: {
					name: dto.name,
					ownerId: userId,
					createdBy: userId,
					isPublic: dto.isPublic,
					sportId: dto.sportId,
					leagueType: dto.leagueType
				}
			});
			this.logger.verbose(`Successfully created league '${dto.name}' for userId ${userId}`);
		} catch (error) {
			this.logger.error(`Problem creating league '${dto.name}' for userId ${userId}`);
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
	async getOne(leagueId: number): Promise<League> {
		this.logger.verbose(`Getting league data for leagueId '${leagueId}'`);

		// make sure user belongs to league or has certain privs or league is public. maybe make this a separate function

		const league: League = await this.prisma.league.findUnique({
			where: {
				id: leagueId
			},
			include: {
				sport: true
			}
		});

		if (!league) {
			this.logger.error(`Problem getting league data for leagueId '${leagueId}'. League does not exist.`);
			throw new NotFoundException('Problem getting league data. League does not exist.');
		}

		this.logger.verbose(`Successfully retreived league data for leagueId '${leagueId}'`);
		return league;
	}

	/**
	 * Retreives multiple league data from DB
	 *
	 * @param {number[]} leagueIds
	 * @return {*}  {Promise<League[]>}
	 * @memberof LeagueService
	 */
	async getMany(leagueIds: number[]): Promise<League[]> {
		this.logger.verbose(`Getting league data for leagueIds '${leagueIds}'`);

		// make sure user belongs to league or has certain privs or league is public. maybe make this a separate function

		const leagues: League[] = await this.prisma.league.findMany({
			where: {
				id: { in: leagueIds }
			},
			include: {
				sport: true
			}
		});

		if (!leagues || leagues?.length < 1 || leagues?.length !== leagueIds.length) {
			this.logger.error(`Problem getting league data for leagueIds '${leagueIds}'. One or more leagues may not exist.`);
			throw new NotFoundException('Problem getting league data. One or more leagues may not exist.');
		}

		this.logger.verbose(`Successfully retreived league data for leagueIds '${leagueIds}'`);
		return leagues;
	}
}
