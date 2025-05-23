import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ValidatePaymentDto {
    @ApiProperty()
    @IsNotEmpty()
    account_number: string;

    @ApiProperty()
    @IsNotEmpty()
    account_name: string;

    @ApiProperty()
    @IsNotEmpty()
    bank_name: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;
    
    @ApiProperty()
    @IsNotEmpty()
    amount: number;
}
