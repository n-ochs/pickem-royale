import { Response as Res } from 'express';

import { AuthService } from '@auth/auth.service';
import { AuthDto } from '@auth/dto';
import { REFRESH_TOKEN } from '@common/constants';
import { GetCurrentUser, GetCurrentUserId, Public } from '@common/decorators';
import { RtGuard } from '@common/guards';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async isAuthenticated(): Promise<void> {
		return this.authService.isAuthenticated();
	}

	@Get('user')
	@HttpCode(HttpStatus.OK)
	async getUserDetails(@GetCurrentUserId() userId: number): Promise<Omit<User, 'hash' | 'hashedRt'>> {
		return this.authService.getUserDetails(userId);
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
	async signIn(@Body() dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<void> {
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
