import * as argon from 'argon2';
import { Response as Res } from 'express';

import { AuthDTO } from '@auth/dto';
import { JwtPayload, Tokens as Tokens } from '@auth/types';
import { UserDetails } from '@auth/types/user_details.type';
import { ACCESS_TOKEN, MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN, REFRESH_TOKEN } from '@common/constants';
import { TokenCookieOptions } from '@common/models';
import { LoggerService } from '@logger/logger.service';
import { BadRequestException, ForbiddenException, Injectable, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly logger: LoggerService
	) {}

	/**
	 * Generates JWT tokens - access & refresh
	 *
	 * @private
	 * @param {number} userId
	 * @param {string} email
	 * @return {*}  {Promise<Tokens>}
	 * @memberof AuthService
	 */
	private async generateTokens(userId: number, email: string): Promise<Tokens> {
		this.logger.verbose(`Generating JWTs for user with email: '${email}'`, AuthService.name);

		const jwtPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
			sub: userId,
			email: email
		};

		const [accessToken, refreshToken]: string[] = await Promise.all([
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.AT_SECRET,
				expiresIn: '15m'
			}),
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.RT_SECRET,
				expiresIn: '2h'
			})
		]);

		this.logger.verbose(`Successfully generated tokens for user with email: '${email}'`, AuthService.name);

		return { accessToken, refreshToken };
	}

	/**
	 * Hashes refresh token and stores in DB user record
	 *
	 * @private
	 * @param {number} userId
	 * @param {string} rt
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	private async updateRtHash(userId: number, rt: string): Promise<void> {
		this.logger.verbose(`Updating RT hash for user ID: '${userId}'`, AuthService.name);

		const hash: string = await argon.hash(rt);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				hashedRt: hash
			}
		});

		this.logger.verbose(`Successfully updated RT hash in DB for user ID: '${userId}'`, AuthService.name);
	}

	/**
	 * Gets user details
	 *
	 * @param {number} userId
	 * @return {*}  {(Promise<Omit<User, 'hash' | 'hashedRt'>>)}
	 * @memberof AuthService
	 */
	async userDetails(userId: number): Promise<UserDetails> {
		this.logger.verbose(`Getting user info for user ID: '${userId}'`, AuthService.name);

		const user: UserDetails = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if (!user) {
			this.logger.error(`User not found for user ID: '${userId}'`, AuthService.name);
			throw new ForbiddenException('Access Denied');
		}

		this.logger.verbose(`Found user info for user ID: '${userId}'`, AuthService.name);

		return user;
	}

	/**
	 * Allows users to sign up with email & password
	 *
	 * @param {AuthDTO} body
	 * @param {Res} res
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	async signUp(body: AuthDTO, @Response({ passthrough: true }) res: Res): Promise<void> {
		this.logger.verbose(`Creating user account for user with email '${body.email}'`, AuthService.name);

		// Hash password
		const hashedPassword: string = await argon.hash(body.password);

		try {
			// Create user in DB
			const newUser: User = await this.prisma.user.create({
				data: {
					email: body.email,
					hash: hashedPassword
				}
			});

			// Generate Tokens
			const { accessToken, refreshToken } = await this.generateTokens(newUser.id, newUser.email);
			await this.updateRtHash(newUser.id, refreshToken);

			// Send response as cookies
			res.cookie(ACCESS_TOKEN, accessToken, new TokenCookieOptions(null, MAX_AGE_ACCESS_TOKEN, process.env.DOMAIN, '/'));
			res.cookie(REFRESH_TOKEN, refreshToken, new TokenCookieOptions(null, MAX_AGE_REFRESH_TOKEN, process.env.DOMAIN, '/api/auth/refresh'));

			this.logger.verbose(`Successfully created user account and signed in user with email: '${body.email}'`, AuthService.name);
		} catch (error) {
			this.logger.error(`Problem creating user account for user with email: '${body.email}'. User with email may already exist`, AuthService.name);
			throw new BadRequestException('Problem creating user account. User with email may already exist. Please try again or contact support.');
		}

		return;
	}

	/**
	 * Allows users to sign in with email & password. Sends JWT cookies as response
	 *
	 * @param {AuthDTO} body
	 * @param {Res} res
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	async signIn(body: AuthDTO, @Response({ passthrough: true }) res: Res): Promise<UserDetails> {
		this.logger.verbose(`Signing in user with email: '${body.email}'`, AuthService.name);
		// Find user
		const user: User = await this.prisma.user.findUnique({
			where: {
				email: body.email
			}
		});
		if (!user) {
			this.logger.error(`Problem signing in user with email: '${body.email}'. Account with provided email does not exist`, AuthService.name);
			throw new ForbiddenException('Access Denied');
		}

		// Verify password & hash match
		const passwordMatches: boolean = await argon.verify(user.hash, body.password);
		if (!passwordMatches) {
			this.logger.error(`Problem signing in user with email: '${body.email}'. Client password hash does not match DB password hash`, AuthService.name);
			throw new ForbiddenException('Access Denied');
		}

		// Generate Tokens
		const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);
		await this.updateRtHash(user.id, refreshToken);

		// Send response as cookies
		res.cookie(ACCESS_TOKEN, accessToken, new TokenCookieOptions(null, MAX_AGE_ACCESS_TOKEN, process.env.DOMAIN, '/'));
		res.cookie(REFRESH_TOKEN, refreshToken, new TokenCookieOptions(null, MAX_AGE_REFRESH_TOKEN, process.env.DOMAIN, '/api/auth/refresh'));

		this.logger.verbose(`Successfully signed in user with email: '${body.email}'`, AuthService.name);
		return { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
	}

	/**
	 * Allows users to sign out
	 *
	 * @param {number} userId
	 * @param {Res} res
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	async signOut(userId: number, @Response({ passthrough: true }) res: Res): Promise<void> {
		this.logger.verbose(`Signing out user with user ID: '${userId}'`, AuthService.name);

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

		// Clear cookies
		res.clearCookie(ACCESS_TOKEN, { domain: process.env.DOMAIN, path: '/' });
		res.clearCookie(REFRESH_TOKEN, { domain: process.env.DOMAIN, path: '/api/auth/refresh' });

		this.logger.verbose(`Successfully signed out user with user ID: '${userId}'`, AuthService.name);
		return;
	}

	/**
	 * Refreshes JWT tokens - access & refresh
	 *
	 * @param {number} userId
	 * @param {string} rt
	 * @param {Res} res
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	async refreshTokens(userId: number, rt: string, @Response({ passthrough: true }) res: Res): Promise<void> {
		this.logger.verbose(`Refreshing tokens for user with user ID: '${userId}'`, AuthService.name);

		// Find the user
		const user: User = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) {
			this.logger.error(`Problem finding user with user ID: '${userId}'`, AuthService.name);
			res.clearCookie(ACCESS_TOKEN, { domain: process.env.DOMAIN, path: '/' });
			res.clearCookie(REFRESH_TOKEN, { domain: process.env.DOMAIN, path: '/api/auth/refresh' });

			throw new ForbiddenException('Access Denied');
		}

		if (!user?.hashedRt) {
			this.logger.error(`Hashed RT does not exist in DB for user ID: '${userId}'`, AuthService.name);
			res.clearCookie(ACCESS_TOKEN, { domain: process.env.DOMAIN, path: '/' });
			res.clearCookie(REFRESH_TOKEN, { domain: process.env.DOMAIN, path: '/api/auth/refresh' });

			throw new ForbiddenException('Access Denied');
		}

		// Verify refreshToken & hashedRt match
		const rtMatches: boolean = await argon.verify(user.hashedRt, rt);

		// If RT hash doesn't match, reset hashed RT in DB and clear cookie, throw error
		if (!rtMatches) {
			this.logger.error(`Request RT does not match DB hashed RT for user with user ID: '${userId}'`, AuthService.name);
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					hashedRt: null
				}
			});
			res.clearCookie(ACCESS_TOKEN, { domain: process.env.DOMAIN, path: '/' });
			res.clearCookie(REFRESH_TOKEN, { domain: process.env.DOMAIN, path: '/api/auth/refresh' });
			throw new ForbiddenException('Access Denied');
		}

		// Generate Tokens
		const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);
		await this.updateRtHash(user.id, refreshToken);

		// Send response as cookies
		res.cookie(ACCESS_TOKEN, accessToken, new TokenCookieOptions(null, MAX_AGE_ACCESS_TOKEN, process.env.DOMAIN, '/'));
		res.cookie(REFRESH_TOKEN, refreshToken, new TokenCookieOptions(null, MAX_AGE_REFRESH_TOKEN, process.env.DOMAIN, '/api/auth/refresh'));

		this.logger.verbose(`Successfully refreshed token for user with user ID: '${userId}'`, AuthService.name);
		return;
	}
}
