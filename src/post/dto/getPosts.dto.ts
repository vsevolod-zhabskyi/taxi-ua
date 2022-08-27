import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetPostsDto {
  @IsInt()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  published: boolean;
}
