import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearProductDto {
    @IsOptional()
    @IsString()
    name: string = '';

    @IsOptional()
    @IsString()
    code: string = '';
    
    @IsInt()
    @Min(1)
    page: number = 1;
  
    @IsInt()
    @Min(1)
    limit: number = 10;
}

