import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { AuthDto } from '@auth/dto';
import { AuthService } from '@auth/auth.service';
import { Tokens } from '@auth/types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() dto: AuthDto): Promise<Tokens> {
		return this.authService.signUp(dto);
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() dto: AuthDto): Promise<Tokens> {
		return this.authService.signIn(dto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('signout')
	@HttpCode(HttpStatus.OK)
	async signOut(@Req() req: Request): Promise<void> {
		return this.authService.signOut(req.user['sub']);
	}

	@UseGuards(AuthGuard('jwt-refresh'))
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Req() req: Request): Promise<Tokens> {
		return this.authService.refreshToken(req.user['sub'], req.user['refreshToken']);
	}
}
