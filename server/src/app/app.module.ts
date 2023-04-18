import { AuthModule } from '@auth/auth.module';
import { AtGuard } from '@common/guards';
import { RequestLoggerMiddleware } from '@common/middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@prismaModule/prisma.module';

@Module({
	imports: [AuthModule, PrismaModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AtGuard
		}
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RequestLoggerMiddleware).forRoutes('*');
	}
}
