import { Response as ExpressResponse } from 'express';

import { AuthService } from '@auth/auth.service';
import { AuthDTO } from '@auth/dto';
import { UserDetails } from '@auth/types';
import { REFRESH_TOKEN } from '@common/constants';
import { GetCurrentUser, GetCurrentUserId, Public } from '@common/decorators';
import { RefreshTokenGuard } from '@common/guards';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('user')
	@HttpCode(HttpStatus.OK)
	async userDetails(@GetCurrentUserId() userId: number): Promise<UserDetails> {
		return this.authService.userDetails(userId);
	}

	@Public()
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() body: AuthDTO, @Response({ passthrough: true }) response: ExpressResponse): Promise<void> {
		return this.authService.signUp(body, response);
	}

	@Public()
	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() body: AuthDTO, @Response({ passthrough: true }) response: ExpressResponse): Promise<UserDetails> {
		return this.authService.signIn(body, response);
	}

	@Post('signout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async signOut(@GetCurrentUserId() userId: number, @Response({ passthrough: true }) response: ExpressResponse): Promise<void> {
		return this.authService.signOut(userId, response);
	}

	@Public()
	@UseGuards(RefreshTokenGuard)
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@GetCurrentUserId() userId: number, @GetCurrentUser(REFRESH_TOKEN) refreshToken: string, @Response({ passthrough: true }) response: ExpressResponse): Promise<void> {
		return this.authService.refreshTokens(userId, refreshToken, response);
	}
}
