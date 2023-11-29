import { ClsModule } from 'nestjs-cls';
import { v4 as uuid } from 'uuid';

import { AuthModule } from '@auth/auth.module';
import { AcessTokenGuard } from '@common/guards';
import { TransformationInterceptor } from '@common/interceptors';
import { ReqResLogger } from '@common/middleware';
import { LeagueModule } from '@league/league.module';
import { LoggerModule } from '@logger/logger.module';
import { LoggerService } from '@logger/logger.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '@prismaModule/prisma.module';
import { StdModule } from '@std/std.module';

@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			middleware: { mount: true, generateId: true, idGenerator: (req: Request) => req.headers['request_id'] ?? uuid() }
		}),
		AuthModule,
		LeagueModule,
		LoggerModule,
		PrismaModule,
		StdModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AcessTokenGuard
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformationInterceptor
		}
	]
})
export class AppModule implements NestModule {
	logger: LoggerService = new LoggerService(null);

	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(ReqResLogger).forRoutes('*');
		this.logger.debug(`Mounting ${ReqResLogger.name} to * routes 🧰`, AppModule.name);
	}
}
