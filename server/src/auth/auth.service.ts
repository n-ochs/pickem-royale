import * as argon from 'argon2';
import * as dayjs from 'dayjs';
import { Response as Res } from 'express';

import { AuthDto } from '@auth/dto';
import { JwtPayload, Tokens as Tokens } from '@auth/types';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@common/constants';
import { BadRequestException, ForbiddenException, Injectable, Logger, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '@prismaModule/prisma.service';

@Injectable()
export class AuthService {
	private logger: Logger = new Logger(AuthService.name);

	constructor(private prisma: PrismaService, private jwtService: JwtService) {}

	/**
	 * Generates JWT tokens - access & refresh
	 *
	 * @private
	 * @param {number} userId
	 * @param {string} email
	 * @return {*}  {Promise<Tokens>}
	 * @memberof AuthService
	 */
	private async getTokens(userId: number, email: string): Promise<Tokens> {
		this.logger.verbose(`Generating JWTs for user with email: '${email}'`);

		const jwtPayload: JwtPayload = {
			sub: userId,
			email: email
		};

		const [at, rt]: string[] = await Promise.all([
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.AT_SECRET,
				expiresIn: '15m'
			}),
			this.jwtService.signAsync(jwtPayload, {
				secret: process.env.RT_SECRET,
				expiresIn: '2h'
			})
		]);

		this.logger.verbose(`Successfully generated tokens for user with email: '${email}'`);

		return {
			accessToken: at,
			refreshToken: rt
		};
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
		this.logger.verbose(`Updating RT hash for user ID: '${userId}'`);

		const hash: string = await argon.hash(rt);

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				hashedRt: hash
			}
		});

		this.logger.verbose(`Successfully updated RT hash in DB for user ID: '${userId}'`);
	}

	/**
	 * Quick check to see if user is authenticated
	 *
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	async isAuthenticated(): Promise<void> {
		return;
	}

	/**
	 * Allows users to sign up with email & password
	 *
	 * @param {AuthDto} dto
	 * @param {Res} res
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	async signUp(dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<void> {
		this.logger.verbose(`Creating user account for user with email '${dto.email}'`);

		// Hash password
		const hashedPassword: string = await argon.hash(dto.password);

		try {
			// Create user in DB
			const newUser: User = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash: hashedPassword
				}
			});

			// Generate Tokens
			const tokens: Tokens = await this.getTokens(newUser.id, newUser.email);
			await this.updateRtHash(newUser.id, tokens.refreshToken);
			const accessTokenExp: Date = dayjs().add(15, 'm').toDate();
			const refreshTokenExp: Date = dayjs().add(2, 'h').toDate();

			// Send response with cookies
			res.cookie(ACCESS_TOKEN, tokens.accessToken, { httpOnly: true, secure: true, expires: accessTokenExp, sameSite: true, path: '/' }).cookie(REFRESH_TOKEN, tokens.refreshToken, {
				httpOnly: true,
				secure: true,
				expires: refreshTokenExp,
				sameSite: true,
				path: '/'
			});

			this.logger.verbose(`Successfully created user account and signed in user with email: '${dto.email}'`);
		} catch (error) {
			this.logger.error(`Problem creating user account for user with email: '${dto.email}'. User with email may already exist`);
			throw new BadRequestException('Problem creating user account. User with email may already exist. Please try again or contact support.');
		}
	}

	/**
	 * Allows users to sign in with email & password. Sends JWT cookies as response
	 *
	 * @param {AuthDto} dto
	 * @param {Res} res
	 * @return {*}  {Promise<void>}
	 * @memberof AuthService
	 */
	async signIn(dto: AuthDto, @Response({ passthrough: true }) res: Res): Promise<void> {
		this.logger.verbose(`Signing in user with email: '${dto.email}'`);
		// Find user
		const user: User = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});
		if (!user) {
			this.logger.error(`Problem signing in user with email: '${dto.email}'. Account with provided email does not exist`);
			throw new ForbiddenException('Access Denied');
		}

		// Verify password & hash match
		const passwordMatches: boolean = await argon.verify(user.hash, dto.password);
		if (!passwordMatches) {
			this.logger.error(`Problem signing in user with email: '${dto.email}'. Client password hash does not match DB password hash`);
			throw new ForbiddenException('Access Denied');
		}

		// Generate Tokens
		const tokens: Tokens = await this.getTokens(user.id, user.email);
		await this.updateRtHash(user.id, tokens.refreshToken);
		const accessTokenExp: Date = dayjs().add(15, 'm').toDate();
		const refreshTokenExp: Date = dayjs().add(2, 'h').toDate();

		// Send response with cookies
		res.cookie(ACCESS_TOKEN, tokens.accessToken, { httpOnly: true, secure: true, expires: accessTokenExp, sameSite: true, path: '/', domain: process.env.DOMAIN });
		res.cookie(REFRESH_TOKEN, tokens.refreshToken, { httpOnly: true, secure: true, expires: refreshTokenExp, sameSite: true, path: '/', domain: process.env.DOMAIN });
		res.end();

		this.logger.verbose(`Successfully signed in user with email: '${dto.email}'`);
		return;
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
		this.logger.verbose(`Signing out user with user ID: '${userId}'`);

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
		res.clearCookie(ACCESS_TOKEN);
		res.clearCookie(REFRESH_TOKEN);
		res.end();

		this.logger.verbose(`Successfully signed out user with user ID: '${userId}'`);
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
		this.logger.verbose(`Refreshing tokens for user with user ID: '${userId}'`);

		// Find the user
		const user: User = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		if (!user || !user.hashedRt) {
			this.logger.error(`Problem finding user with user ID: '${userId}'`);
			throw new ForbiddenException('Access Denied');
		}

		// Verify refreshToken & hashedRt match
		const rtMatches: boolean = await argon.verify(user.hashedRt, rt);
		if (!rtMatches) {
			this.logger.error(`Request RT does not match DB hashed RT for user with user ID: '${userId}'`);
			throw new ForbiddenException('Access Denied');
		}

		// Generate Tokens
		const tokens: Tokens = await this.getTokens(user.id, user.email);
		await this.updateRtHash(user.id, tokens.refreshToken);

		const accessTokenExp: Date = dayjs().add(15, 'm').toDate();
		const refreshTokenExp: Date = dayjs().add(2, 'h').toDate();

		// Send response with cookies
		res.cookie(ACCESS_TOKEN, tokens.accessToken, { httpOnly: true, secure: true, expires: accessTokenExp, sameSite: true, path: '/', domain: process.env.DOMAIN });
		res.cookie(REFRESH_TOKEN, tokens.refreshToken, { httpOnly: true, secure: true, expires: refreshTokenExp, sameSite: true, path: '/', domain: process.env.DOMAIN });
		res.end();

		this.logger.verbose(`Successfully refreshed token for user with user ID: '${userId}'`);
		return;
	}
}
