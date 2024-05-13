import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    department: string;

    @IsNotEmpty()
    @IsString()
    municipality: string;

    @IsNotEmpty()
    @IsString()
    complement: string;
}
