import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLeagueDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(30)
	name: string;

	@IsOptional()
	@IsNumber()
	ownerId: number;

	@IsNotEmpty()
	@IsBoolean()
	isPublic: boolean;

	@IsNotEmpty()
	@IsNumber()
	sportId: number;

	@IsNotEmpty()
	@IsNumber()
	leagueTypeId: number;
}
