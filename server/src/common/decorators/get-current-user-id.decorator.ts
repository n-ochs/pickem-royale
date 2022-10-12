import { JwtPayload } from '@auth/types';
import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const GetCurrentUserId: () => ParameterDecorator = createParamDecorator((_: undefined, ctx: ExecutionContext) => {
	const request: any = ctx.switchToHttp().getRequest();
	const user: JwtPayload = request.user as JwtPayload;
	return user.sub;
});
