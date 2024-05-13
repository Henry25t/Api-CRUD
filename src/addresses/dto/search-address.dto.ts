import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchAddressDto {
    @IsOptional()
    @IsString()
    department: string = '';

    @IsOptional()
    @IsString()
    municipality: string = '';

    @IsOptional()
    @IsString()
    complement: string = '';
    
    @IsInt()
    @Min(1)
    page: number = 1;
  
    @IsInt()
    @Min(1)
    limit: number = 10;
}

