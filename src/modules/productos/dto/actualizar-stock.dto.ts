import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class ActualizarStockDto {

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

}
