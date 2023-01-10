import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email address is invalid.' })
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
