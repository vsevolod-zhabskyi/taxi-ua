import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(40)
  password: string;
}
