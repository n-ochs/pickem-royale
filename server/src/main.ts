import { AppModule } from '@app/app.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap(): Promise<void> {
	const app: INestApplication = await NestFactory.create(AppModule);
	app.setGlobalPrefix('/api');
	await app.listen(process.env.PORT || 8081);
}

bootstrap();
