import { AuthModule } from '@auth/auth.module';
import { AtGuard } from '@common/guards';
import { TransformationInterceptor } from '@common/interceptors/transform_response.interceptor';
import { RequestLoggerMiddleware } from '@common/middleware';
import { LeagueModule } from '@league/league.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '@prismaModule/prisma.module';
import { StdModule } from '@std/std.module';

@Module({
	imports: [AuthModule, LeagueModule, PrismaModule, StdModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AtGuard
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformationInterceptor
		}
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RequestLoggerMiddleware).forRoutes('*');
	}
}
