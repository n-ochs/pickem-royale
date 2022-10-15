import { Response as Res } from 'express';

import { AuthService } from '@auth/auth.service';
import { AuthDto } from '@auth/dto';
import { Tokens } from '@auth/types';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@common/constants';
import { GetCurrentUser, GetCurrentUserId, Public } from '@common/decorators';
import { AtGuard, RtGuard } from '@common/guards';
import { Body, Controller, HttpCode, HttpStatus, Post, Response, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() dto: AuthDto): Promise<Tokens> {
		return this.authService.signUp(dto);
	}

	// @Public()
	// @Post('signin')
	// @HttpCode(HttpStatus.OK)
	// async signIn(@Body() dto: AuthDto): Promise<Tokens> {
	// 	return this.authService.signIn(dto);
	// }

	@Public()
	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<any> {
		const tokens: Tokens = await this.authService.signIn(dto);

		// replace w/ dayjs
		const accessTokenExp: Date = new Date(new Date().getTime() + 30 * 60 * 1000);
		const refreshTokenExp: Date = new Date(new Date().getTime() + 120 * 60 * 1000);

		res.cookie(ACCESS_TOKEN, tokens.accessToken, { httpOnly: true, secure: true, expires: accessTokenExp, sameSite: true }).cookie(REFRESH_TOKEN, tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			expires: refreshTokenExp,
			sameSite: true
		});
		return { msg: 'success' };
	}

	@UseGuards(AtGuard)
	@Post('signout')
	@HttpCode(HttpStatus.OK)
	async signOut(@GetCurrentUserId() userId: number): Promise<void> {
		return this.authService.signOut(userId);
	}

	@Public()
	@UseGuards(RtGuard)
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@GetCurrentUserId() userId: number, @GetCurrentUser(REFRESH_TOKEN) refreshToken: string): Promise<Tokens> {
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
