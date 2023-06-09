import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { JwtPayload } from '@auth/types';
import { ACCESS_TOKEN, JWT } from '@common/constants';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, JWT) {
	constructor() {
		super({
			jwtFromRequest: AtStrategy.extractAtJwtFromCookie,
			ignoreExpiration: false,
			secretOrKey: process.env.AT_SECRET
		});
	}

	private static extractAtJwtFromCookie(req: Request): string | null {
		if (req.cookies && ACCESS_TOKEN in req.cookies) {
			return req.cookies[ACCESS_TOKEN];
		}
		return null;
	}

	// Validate JWT Signature - Passport already handles this, so all we need to do is return the payload
	// https://docs.nestjs.com/recipes/passport#implementing-passport-jwt
	validate(payload: JwtPayload): JwtPayload {
		return payload;
	}
}
