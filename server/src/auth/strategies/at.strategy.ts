import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '@auth/types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.AT_SECRET
		});
	}

	validate(payload: JwtPayload): JwtPayload {
		return payload;
	}
}
