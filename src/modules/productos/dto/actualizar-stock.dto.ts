import { IsNumber, Min } from 'class-validator';

export class ActualizarStockDto {

  @IsNumber()
  @Min(0)
  stock: number;

}
