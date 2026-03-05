import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Stiven Galeano',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Unique email address',
    example: 'stiven@example.com',
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Secure password (min 8 characters)',
    example: 'Password123!',
  })
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
