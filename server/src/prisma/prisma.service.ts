import { LoggerService } from '@logger/logger.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor(private readonly logger: LoggerService) {
		super();
	}

	/**
	 * Connects to DB
	 *
	 * @return {*}  {Promise<void>}
	 * @memberof PrismaService
	 */
	async onModuleInit(): Promise<void> {
		await this.$connect();
		this.logger.debug('Prisma ORM initialized 🔼 🔌', PrismaService.name);
	}
}
