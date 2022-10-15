import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
	@Get()
	testing(): string {
		return 'hello!';
	}
}
