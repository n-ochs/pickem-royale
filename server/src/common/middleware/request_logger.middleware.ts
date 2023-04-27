import * as dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	private readonly logger: Logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method } = request;
		const userAgent: string = request.get('user-agent') || '';
		const path: string = request.baseUrl.split('/api')?.[1];
		const requestTs: string = dayjs().toISOString();
		const requestId: string = (request.headers?.['request_id'] as string) || '';

		this.logger.log(`REQUEST ${requestId ? requestId + ' ' : ''}${requestTs} ${method} ${path} from ${userAgent} ${ip}`);

		response.on('close', () => {
			const { statusCode } = response;
			const responseTs: string = dayjs().toISOString();
			const contentLength: string = response.get('content-length');

			this.logger.log(`RESPONSE ${requestId ? requestId + ' ' : ''}${responseTs} ${method} ${path} ${statusCode} ${contentLength ? contentLength + ' ' : ''}- ${userAgent} ${ip}`);
		});

		next();
	}
}
