import { NextFunction, Request, Response } from 'express';

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method } = request;
		const userAgent: string = request.get('user-agent') || '';
		const path: string = request.baseUrl.split('/api')?.[1];

		this.logger.log(`REQUEST ${method} ${path} from ${userAgent} ${ip}`);

		response.on('close', () => {
			const { statusCode } = response;
			const contentLength: string = response.get('content-length');

			this.logger.log(`RESPONSE ${method} ${path} ${statusCode} ${contentLength ? contentLength + ' ' : ''}- ${userAgent} ${ip}`);
		});

		next();
	}
}
