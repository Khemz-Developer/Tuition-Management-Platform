import { IsEmail, IsString, MinLength, IsEnum, IsOptional, ValidateNested, Matches } from 'class-validator';
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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'Password must contain at least one special character' })
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
