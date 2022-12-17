import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // converts query parameter string passeed from Frontend to number here
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type( () => Number ) // converts query parameter string passeed from Frontend to number here
    offset?: number;

}