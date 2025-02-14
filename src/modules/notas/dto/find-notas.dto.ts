import {
    IsArray,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';
export class FindOneNotaParams {
    @IsUUID()
    @IsNotEmpty()
    id: string;
}

export class FindNotas {
    @IsArray()
    @IsUUID(undefined, { each: true }) // Qualquer UUID válido: v1, v3, v5...
    ids: string[];
}

