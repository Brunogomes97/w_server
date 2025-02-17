import { IsIn, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateNotaDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 250)
    description: string;

    @IsNotEmpty()
    @IsString()
    @IsIn([
        'personal',
        'work',
        'study',
        'ideia',
        'reminder',
        'todo',
        'meeting',
    ])
    type: string;
}

