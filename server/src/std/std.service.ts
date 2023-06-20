import { StdTables } from '@common/constants';
import { StdTable } from '@common/models';
import { LoggerService } from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import { StdLeagueTypeService, StdSportService } from '@std/services';

@Injectable()
export class StdService {
	constructor(private readonly stdLeagueTypeService: StdLeagueTypeService, private readonly stdSportService: StdSportService, private readonly logger: LoggerService) {}

	/**
	 * Finds all Std Tables in the DB
	 *
	 * @return {*}  {Promise<{ name: string; data: StdTable[] }[]>}
	 * @memberof StdService
	 */
	async findAll(): Promise<{ name: string; data: StdTable[] }[]> {
		this.logger.log('Getting all data from Std Tables', StdService.name);
		return Promise.all([
			{ name: StdTables.STD_SPORT, data: await this.stdSportService.findAll() },
			{ name: StdTables.STD_LEAGUE_TYPE, data: await this.stdLeagueTypeService.findAll() }
		]);
	}
}
