import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimerPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args: any[]) {
    if(parseInt(value)<0)
    {
      return 0;
    }
    else{
      return value;
    }
  }
}
