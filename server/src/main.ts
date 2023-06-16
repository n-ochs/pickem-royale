import * as cookieParser from 'cookie-parser';

import { AppModule } from '@app/app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '@prismaModule/prisma.service';

/**
 * Initializes NestJS App
 *
 * @return {*}  {Promise<void>}
 */
async function bootstrap(): Promise<void> {
	/* ------------------------------- Create App ------------------------------- */
	const app: INestApplication = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
	const logger: Logger = new Logger();
	logger.log('Logger initialized 📝');

	/* ------------------------------- Set Globals ------------------------------ */
	app.setGlobalPrefix('/api');
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({
		methods: '*',
		origin: process.env.ORIGIN,
		exposedHeaders: '*',
		credentials: true,
		allowedHeaders: ['Access-Control-Allow-Origin', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'request_id']
	});

	/* ------------------------------ Enable Prisma ----------------------------- */
	const prismaService: PrismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);
	logger.log('Prisma ORM initialized 🔼 🔌');

	/* --------------------------------- Listen --------------------------------- */
	await app.listen(process.env.PORT);
	logger.log(`Application running on port ${process.env.PORT} 🚀`);
}

void bootstrap();
