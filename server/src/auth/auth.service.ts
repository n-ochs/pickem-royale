import * as argon from 'argon2';

import { AuthDto } from '@auth/dto';
import { JwtPayload, Tokens as Tokens } from '@auth/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwtService: JwtService) {}

	async getTokens(userId: number, email: string): Promise<Tokens> {
		const jwtPayload: JwtPayload = {
			sub: userId,
			email: email
		};

		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.AT_SECRET,
				expiresIn: '15m'
			}),
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.RT_SECRET,
				expiresIn: '7d'
			})
		]);

		return {
			accessToken: at,
			refreshToken: rt
		};
	}

	async updateRtHash(userId: number, rt: string): Promise<void> {
		const hash: string = await argon.hash(rt);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				hashedRt: hash
			}
		});
	}

	async signUp(dto: AuthDto): Promise<Tokens> {
		const hashedPassword: string = await argon.hash(dto.password);

		const newUser: User = await this.prisma.user.create({
			data: {
				email: dto.email,
				hash: hashedPassword
			}
		});

		const tokens: Tokens = await this.getTokens(newUser.id, newUser.email);
		await this.updateRtHash(newUser.id, tokens.refreshToken);

		return tokens;
	}

	async signIn(dto: AuthDto): Promise<Tokens> {
		// Find user
		const user: User = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});
		if (!user) throw new ForbiddenException('Access Denied');

		// Verify password & hash match
		const passwordMatches: boolean = await argon.verify(user.hash, dto.password);
		if (!passwordMatches) throw new ForbiddenException('Access Denied');

		// Issue Tokens
		const tokens: Tokens = await this.getTokens(user.id, user.email);
		await this.updateRtHash(user.id, tokens.refreshToken);

		return tokens;
	}

	async signOut(userId: number): Promise<void> {
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRt: {
					not: null
				}
			},
			data: {
				hashedRt: null
			}
		});
	}

	async refreshTokens(userId: number, rt: string): Promise<Tokens> {
		// Find the user
		const user: User = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

		// Verify password & hash match
		const rtMatches: boolean = await argon.verify(user.hashedRt, rt);
		if (!rtMatches) throw new ForbiddenException('Access Denied');

		// Issue Tokens
		const tokens: Tokens = await this.getTokens(user.id, user.email);
		await this.updateRtHash(user.id, tokens.refreshToken);

		return tokens;
	}
}
