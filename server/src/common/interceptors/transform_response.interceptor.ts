import { map, Observable } from 'rxjs';

import { StdResponse } from '@common/models/std_response.model';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class TransformationInterceptor<T> implements NestInterceptor<T, StdResponse<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<StdResponse<T>> {
		return next.handle().pipe(
			map((data) => ({
				data: data,
				message: data?.message,
				statusCode: context.switchToHttp().getResponse().statusCode,
				requestId: context.switchToHttp().getRequest().headers?.['request_id']
			}))
		);
	}
}
