import { IsEmail, IsString, MinLength, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../models/user.schema';

class TeacherProfileDto {
  @IsString({ each: true })
  subjects: string[];

  @IsString({ each: true })
  grades: string[];

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TeacherProfileDto)
  teacherProfile?: TeacherProfileDto;

  @IsString()
  @IsOptional()
  teacherId?: string; // Link student to teacher during registration

  @IsString()
  @IsOptional()
  teacherSlug?: string; // Alternative: Use slug to find teacher
}
