import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [forwardRef(() => AuthModule), forwardRef(() => PrismaModule)],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
