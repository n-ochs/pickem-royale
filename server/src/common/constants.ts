import { JwtPayloadWithRt, Tokens } from '@auth/types';

export const IS_PUBLIC: string = 'isPublic';
export const JWT: string = 'jwt';
export const JWT_REFRESH: string = 'jwt-refresh';
export const ACCESS_TOKEN: keyof Tokens = 'accessToken';
export const REFRESH_TOKEN: keyof JwtPayloadWithRt = 'refreshToken';

export abstract class StdTables {
	static readonly STD_SPORT = 'std_sport';
	static readonly STD_LEAGUE_TYPE = 'std_league_type';
}
