import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { AuthDto } from '@auth/dto';
import { AuthService } from '@auth/auth.service';
import { Tokens } from '@auth/types';
import { AtGuard, RtGuard } from '@common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '@common/decorators';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() dto: AuthDto): Promise<Tokens> {
		return this.authService.signUp(dto);
	}

	@Public()
	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() dto: AuthDto): Promise<Tokens> {
		return this.authService.signIn(dto);
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
	async refreshToken(@GetCurrentUserId() userId: number, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
