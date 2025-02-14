import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateNotaDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsIn([
        'personal',
        'work',
        'study',
        'idea',
        'reminder',
        'todo',
        'meeting',
    ])
    type?: string;
}

