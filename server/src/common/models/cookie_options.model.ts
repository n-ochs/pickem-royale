import { CookieOptions } from 'express';

export class TokenCookieOptions implements CookieOptions {
	httpOnly?: boolean = true; // help prevent XSS - prevents cookie from being accessible by JS in browser
	secure?: boolean = true; // help prevent XSS - cookie only sent over secure connections
	expires?: Date = null;
	sameSite?: boolean | 'lax' | 'strict' | 'none' = 'strict'; // help prevent CSRF - cookie will only be sent with requests originating from the same site
	path?: string = null; // cookie will only be sent to specified path
	domain?: string = null;
	maxAge?: number = null;

	constructor(expires: Date, maxAge: number, domain: string, path: string) {
		this.expires = expires;
		this.maxAge = maxAge;
		this.domain = domain;
		this.path = path;
	}
}
