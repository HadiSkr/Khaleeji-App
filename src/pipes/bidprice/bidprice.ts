import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the BidpricePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'bidprice',
})
export class BidpricePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args: any[]) {
    if(value!=undefined){
        value = value.replace(",", "");
    }else{
        value="";
    }
      return (parseInt(value.replace(",", ""))+500).toLocaleString();

  }
}
