import { StdTables } from '@common/constants';
import { Injectable, Logger } from '@nestjs/common';

import { StdSportService } from './services/std_sport.service';

@Injectable()
export class StdService {
	private readonly logger: Logger = new Logger(StdService.name);

	constructor(private readonly stdSportService: StdSportService) {}

	/**
	 * Finds all Std Tables in the DB
	 *
	 * @return {*}  {Promise<any[]>}
	 * @memberof StdService
	 */
	async findAll(): Promise<{ name: string; data: any[] }[]> {
		this.logger.log('Getting all data from Std Tables');
		return Promise.all([{ name: StdTables.STD_SPORT, data: await this.stdSportService.findAll() }]);
	}
}
