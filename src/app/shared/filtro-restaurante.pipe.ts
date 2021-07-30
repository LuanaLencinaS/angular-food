import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroRestaurante'
})
export class FiltroRestaurantePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //se não tiver algo digitado nao faz nada
    //se houver algo digitado: compara com o que temos na aplicação e retorna o que tiver incluso a palavra digitada
    if(!value) return null;
    if(!args) return value;
    args = args.toLowerCase();
    return value.filter((data: any)=>{
      return JSON.stringify(data).toLowerCase().includes(args);
    })
  }

}
