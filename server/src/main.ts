import * as cookieParser from 'cookie-parser';

import { AppModule } from '@app/app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '@prismaModule/prisma.service';

async function bootstrap(): Promise<void> {
	// Create App
	const app: INestApplication = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
	const logger: Logger = new Logger();

	// Set Globals
	app.setGlobalPrefix('/api');
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({
		methods: '*',
		origin: process.env.ENVIRONMENT === 'dev' ? 'http://localhost:3000' : 'https://pickemroyale.com',
		exposedHeaders: '*',
		credentials: true
	});

	// Enable Prisma
	const prismaService: PrismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	// Listen
	await app.listen(process.env.PORT || 8080);
	logger.log(`Application listening on port ${process.env.PORT}`);
}

bootstrap();
