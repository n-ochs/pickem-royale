import { Controller, Get } from '@nestjs/common';
import { StdService } from '@std/std.service';

@Controller('std')
export class StdController {
	constructor(private readonly stdService: StdService) {}

	@Get('all')
	async findAll(): Promise<{ name: string; data: any[] }[]> {
		return this.stdService.findAll();
	}
}
