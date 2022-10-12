import { JwtPayloadWithRt } from '@auth/types';
import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const GetCurrentUser: (data?: keyof JwtPayloadWithRt) => ParameterDecorator = createParamDecorator(
	(data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext) => {
		const request: any = ctx.switchToHttp().getRequest();
		if (!data) return request.user;
		return request.user[data];
	}
);
