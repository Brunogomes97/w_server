import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotaDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsString()
    @IsIn([
        'personal',
        'work',
        'study',
        'idea',
        'reminder',
        'todo',
        'meeting',
    ])
    type: string;
}

