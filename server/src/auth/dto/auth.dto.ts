import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email address is invalid.' })
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
