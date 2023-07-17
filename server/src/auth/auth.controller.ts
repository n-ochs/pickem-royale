import { Response as Res } from 'express';

import { AuthService } from '@auth/auth.service';
import { AuthDto } from '@auth/dto';
import { UserDetails } from '@auth/types/user_details.type';
import { REFRESH_TOKEN } from '@common/constants';
import { GetCurrentUser, GetCurrentUserId, Public } from '@common/decorators';
import { RtGuard } from '@common/guards';
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
	async signUp(@Body() dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<void> {
		return this.authService.signUp(dto, res);
	}

	@Public()
	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<UserDetails> {
		return this.authService.signIn(dto, res);
	}

	@Post('signout')
	@HttpCode(HttpStatus.OK)
	async signOut(@GetCurrentUserId() userId: number, @Response({ passthrough: true }) res: Res): Promise<void> {
		return this.authService.signOut(userId, res);
	}

	@Public()
	@UseGuards(RtGuard)
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@GetCurrentUserId() userId: number, @GetCurrentUser(REFRESH_TOKEN) refreshToken: string, @Response({ passthrough: true }) res: Res): Promise<void> {
		return this.authService.refreshTokens(userId, refreshToken, res);
	}
}
