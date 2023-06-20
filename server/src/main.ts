import * as cookieParser from 'cookie-parser';

import { AppModule } from '@app/app.module';
import { LoggerService } from '@logger/logger.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '@prismaModule/prisma.service';

/**
 * Initializes NestJS App
 *
 * @return {*}  {Promise<void>}
 */
async function bootstrap(): Promise<void> {
	/* ------------------------------- Create App ------------------------------- */
	const app: INestApplication = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(app.get(LoggerService));
	const logger: LoggerService = new LoggerService(null);
	logger.log('Logger initialized 📝', 'Main');

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
	logger.log('Prisma ORM initialized 🔼 🔌', 'Main');

	/* --------------------------------- Listen --------------------------------- */
	await app.listen(process.env.PORT);
	logger.log(`Application running on port ${process.env.PORT} 🚀`, 'Main');
}

void bootstrap();
