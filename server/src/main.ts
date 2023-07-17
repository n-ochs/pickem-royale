import cookieParser from 'cookie-parser';

import { AppModule } from '@app/app.module';
import { LoggerService } from '@logger/logger.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

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
	logger.log('Set global prefix to /api', 'Main');

	app.use(cookieParser());
	logger.log('Initialized Cookie Parser 🍪', 'Main');

	app.useGlobalPipes(new ValidationPipe());
	logger.log('Initialized global validation pipe ✅', 'Main');

	app.enableCors({
		methods: '*',
		origin: process.env.ORIGIN,
		exposedHeaders: '*',
		credentials: true,
		maxAge: 3600,
		allowedHeaders: ['Access-Control-Allow-Origin', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'request_id']
	});
	logger.log('Enabled CORS', 'Main');

	app.enableShutdownHooks();

	/* --------------------------------- Listen --------------------------------- */
	await app.listen(process.env.PORT);
	logger.log(`Application running on port ${process.env.PORT} 🚀`, 'Main');
}

void bootstrap();
