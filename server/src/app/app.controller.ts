import { Controller, Post } from '@nestjs/common';

@Controller('app')
export class AppController {
	@Post()
	testing(): string {
		return 'hello!';
	}
}
