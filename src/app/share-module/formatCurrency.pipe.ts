import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'currencyFormat'
})
export class formatCurrency implements PipeTransform{
  transform(value:number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

    return formatter.format(value);
  }
}
