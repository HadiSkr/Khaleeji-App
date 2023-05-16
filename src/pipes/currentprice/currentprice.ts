import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CurrentpricePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'currentprice',
})
export class CurrentpricePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args: any[]) {
    return value;
  }
}
